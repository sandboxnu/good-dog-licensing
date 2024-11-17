import { setSessionCookie } from "@good-dog/auth/cookies";
import { hashPassword } from "@good-dog/auth/password";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { notAuthenticatedProcedureBuilder } from "../internal/init";
import { generateSixDigitCode } from "@good-dog/email/email-service";
import { sendPasswordResetEmail } from "@good-dog/email/password-reset-email";

// click forgot passwd -> enter email -> receive email with code -> enter code & new passwd

const getNewEmailVerificationCodeExpirationDate = () =>
  new Date(Date.now() + 60_000 * 15);

export const sendForgotPasswordEmailProcedure = notAuthenticatedProcedureBuilder
  .input(
    z.object({
      email: z.string().email(),
      newPassword: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No user found with email ${input.email}`,
      });
    }

    // create reset reques. if it exists then delete then create a new one
    const pwdResetReq = await ctx.prisma.passwordResetReq.create({
      data: {
        user: {
          connect: {
            userId: user.userId,
          }
        },
        expiresAt: getNewEmailVerificationCodeExpirationDate(),
      },
    });

    try {
      //await sendEmailVerification(input.email, emailCode);
      await sendPasswordResetEmail(input.email,);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Email confirmation to ${input.email} failed to send.`,
        cause: error,
      });
    }

    // Create/update the password reset code in the database
    await ctx.prisma.passwordResetCode.upsert({
      where: {
        email: input.email,
      },
      update: {
        code: emailCode,
        newHashedPassword: await hashPassword(input.newPassword),
        expiresAt: getNewEmailVerificationCodeExpirationDate(),
      },
      create: {
        code: emailCode,
        email: input.email,
        newHashedPassword: await hashPassword(input.newPassword),
        expiresAt: getNewEmailVerificationCodeExpirationDate(),
      },
    });

    return {
      message: `Password reset code sent to ${input.email}`,
    };
  });

// when the user clicks the link in the email, they are taken to a page where they can enter the code and new password.
export const confirmedPasswordResetProcedure = notAuthenticatedProcedureBuilder
  .input(
    z.object({
      email: z.string().email(),
      code: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const passwordResetCode = await ctx.prisma.passwordResetCode.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!passwordResetCode
      || passwordResetCode.code !== input.code
      || passwordResetCode.expiresAt < new Date()) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `Invalid or expired code for email ${input.email}`,
      });
    }

    // clear seassions and update their password
    await ctx.prisma.user.update({
      where: {
        email: input.email,
      },
      data: {
        hashedPassword: passwordResetCode.newHashedPassword,
        sessions: {
          deleteMany: {},
        },
      },
    });

    // Delete the password reset code
    await ctx.prisma.passwordResetCode.delete({
      where: {
        email: input.email,
      },
    });

    return {
      message: "Code verified",
    };
  });