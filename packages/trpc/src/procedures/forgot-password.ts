import { setSessionCookie } from "@good-dog/auth/cookies";
import { hashPassword } from "@good-dog/auth/password";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { notAuthenticatedProcedureBuilder } from "../internal/init";
import { generateSixDigitCode } from "@good-dog/email/email-service";
import { sendEmailVerification } from "@good-dog/email/verification-email";

// click forgot passwd -> enter email -> receive email with code -> enter code -> enter new passwd

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

    // Send email. If sending fails, throw error.
    const emailCode = generateSixDigitCode();

    try {
      await sendEmailVerification(input.email, emailCode);
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

// when the code is successfully verified,
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

