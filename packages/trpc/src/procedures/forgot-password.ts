import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { hashPassword } from "@good-dog/auth/password";
import { sendPasswordResetEmail } from "@good-dog/email/password-reset-email";

import { baseProcedureBuilder } from "../internal/init";

// click forgot passwd -> enter email -> receive unique link -> enter new passwd at given link

const getNewPasswordResetExpirationDate = () =>
  new Date(Date.now() + 60_000 * 15);

export const sendForgotPasswordEmailProcedure = baseProcedureBuilder
  .input(
    z.object({
      email: z.string().email(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Find user with the given email
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    // If user with that email doesn't exist, throw error
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No user found with given email.`,
      });
    }

    // Delete any existing password reset requests for the user
    await ctx.prisma.passwordResetReq.deleteMany({
      where: {
        user: user,
      },
    });

    // Create new password reset request with updated expired at time
    const pwdResetReq = await ctx.prisma.passwordResetReq.create({
      data: {
        user: {
          connect: {
            userId: user.userId,
          },
        },
        expiresAt: getNewPasswordResetExpirationDate(),
      },
    });

    // Update the user to include the new password reset request
    await ctx.prisma.user.update({
      where: {
        email: input.email,
      },
      data: {
        passwordResetReq: {
          connect: {
            passwordResetId: pwdResetReq.passwordResetId,
          },
        },
      },
    });

    // Send the password reset email
    try {
      await sendPasswordResetEmail(input.email, pwdResetReq.passwordResetId);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Password reset email to ${input.email} failed to send.`,
        cause: error,
      });
    }

    return {
      message: `Password reset email sent to ${input.email}.`,
    };
  });

export const confirmePasswordResetProcedure = baseProcedureBuilder
  .input(
    z.object({
      passwordResetId: z.string(),
      newPassword: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Find password reset request for given passwordResetId
    const passwordResetReq = await ctx.prisma.passwordResetReq.findUnique({
      where: {
        passwordResetId: input.passwordResetId,
      },
      include: {
        user: true,
      },
    });

    // If password reset request doesn't exist, throw error
    if (!passwordResetReq) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No password reset request found for given id.`,
      });
    }

    // If password reset request is expired, throw error
    if (passwordResetReq.expiresAt < new Date()) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `Password reset request is expired.`,
      });
    }

    // Update user's password
    await ctx.prisma.user.update({
      where: {
        email: passwordResetReq.user.email,
      },
      data: {
        hashedPassword: await hashPassword(input.newPassword),
      },
    });

    // Delete the password reset request
    await ctx.prisma.passwordResetReq.delete({
      where: {
        passwordResetId: passwordResetReq.passwordResetId,
      },
    });

    return {
      message: "Password reset.",
    };
  });
