import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { generateSixDigitCode } from "@good-dog/email/email-service";
import { sendEmailVerification } from "@good-dog/email/verification-email";

import { notAuthenticatedProcedureBuilder } from "../internal/init";

const getNewEmailVerificationCodeExpirationDate = () =>
  new Date(Date.now() + 60_000 * 15);

export const sendEmailVerificationProcedure = notAuthenticatedProcedureBuilder
  .input(
    z.object({
      email: z.string().email(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Check if there is already an email verification code for the given email
    const existingEmailVerificationCode =
      await ctx.prisma.emailVerificationCode.findUnique({
        where: {
          email: input.email,
        },
      });
    // If email already verified, throw error
    if (existingEmailVerificationCode?.emailConfirmed) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Email already verified",
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
    // Create/update the email verification code in the database
    await ctx.prisma.emailVerificationCode.upsert({
      where: {
        email: input.email,
      },
      update: {
        code: emailCode,
        expiresAt: getNewEmailVerificationCodeExpirationDate(),
      },
      create: {
        code: emailCode,
        email: input.email,
        expiresAt: getNewEmailVerificationCodeExpirationDate(),
      },
    });

    return {
      message: `Email verification code sent to ${input.email}`,
    };
  });

export const confirmEmailProcedure = notAuthenticatedProcedureBuilder
  .input(
    z.object({
      email: z.string().email(),
      code: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Get email verification from database
    const emailVerificationCode =
      await ctx.prisma.emailVerificationCode.findUnique({
        where: {
          email: input.email,
        },
      });

    // If email already verified, return a success
    if (emailVerificationCode?.emailConfirmed) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Email already verified.`,
      });
    }

    // If email verification not found or given code is wrong, throw UNAUTHORIZED error
    if (
      emailVerificationCode === null ||
      input.code !== emailVerificationCode.code
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `${input.email} is not verified.`,
      });
    }
    // If given code is expired, send new verification code and return RESENT
    if (emailVerificationCode.expiresAt < new Date()) {
      // Send email. If sending fails, throw error.
      const emailCode = generateSixDigitCode();
      try {
        await sendEmailVerification(input.email, emailCode);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Email confirmation to ${input.email} failed to resend.`,
          cause: error,
        });
      }
      // Create/update the email verification code in the database
      await ctx.prisma.emailVerificationCode.update({
        where: {
          email: input.email,
        },
        data: {
          code: emailCode,
          expiresAt: getNewEmailVerificationCodeExpirationDate(),
        },
      });

      return {
        type: "RESENT" as const,
        message: `Code is expired. A new code was sent to ${input.email}.`,
      };
    }

    // If here, the given code was valid, so we can update the emailVerificationCode.
    await ctx.prisma.emailVerificationCode.update({
      where: {
        email: input.email,
      },
      data: {
        emailConfirmed: true,
      },
    });

    return {
      type: "SUCCESS" as const,
      message: `Email was successfully verified. Email: ${input.email}.`,
    };
  });
