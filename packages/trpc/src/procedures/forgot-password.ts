import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "@good-dog/env";

import { baseProcedureBuilder } from "../internal/init";

// click forgot passwd -> enter email -> receive unique link -> enter new passwd at given link

const getNewPasswordResetExpirationDate = () =>
  new Date(Date.now() + 60_000 * 15);

export const sendForgotPasswordEmailProcedure = baseProcedureBuilder
  .input(
    z.object({
      email: z.email(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Find user with the given email
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    // If user with that email doesn't exist, return.
    if (!user) {
      return {
        message: `If a user exists for ${input.email}, a password reset link was sent to the email.`,
      };
    }

    const [_, pwdResetReq] = await ctx.prisma.$transaction([
      // Delete any existing password reset requests for the user
      ctx.prisma.passwordResetReq.deleteMany({
        where: {
          user: user,
        },
      }),
      // Create new password reset request with updated expired at time
      ctx.prisma.passwordResetReq.create({
        data: {
          user: {
            connect: {
              userId: user.userId,
            },
          },
          expiresAt: getNewPasswordResetExpirationDate(),
        },
      }),
    ]);

    // Send the password reset email
    try {
      await ctx.emailService.sendPasswordResetEmail(
        input.email,
        pwdResetReq.passwordResetId,
      );
    } catch (error) {
      if (env.NODE_ENV === "development") {
        console.error(error);
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Password reset email to ${input.email} failed to send.`,
          cause: error,
        });
      }
    }

    return {
      message: `If a user exists for ${input.email}, a password reset link was sent to the email.`,
    };
  });

export const confirmPasswordResetProcedure = baseProcedureBuilder
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

    await ctx.prisma.$transaction([
      // Update user's password
      ctx.prisma.user.update({
        where: {
          email: passwordResetReq.user.email,
        },
        data: {
          hashedPassword: await ctx.passwordService.hashPassword(
            input.newPassword,
          ),
        },
      }),

      // Delete the password reset request
      ctx.prisma.passwordResetReq.delete({
        where: {
          passwordResetId: passwordResetReq.passwordResetId,
        },
      }),
    ]);

    return {
      message: "Password reset.",
    };
  });
