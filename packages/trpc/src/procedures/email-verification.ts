import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { generateSixDigitCode } from "@good-dog/email/email-service";
import { sendEmailVerification } from "@good-dog/email/verification-email";
import { env } from "@good-dog/env";

import { notAuthenticatedProcedureBuilder } from "../internal/init";

// Expiration date for email verification codes is 15 minutes
const getNewEmailVerificationCodeExpirationDate = () =>
  new Date(Date.now() + 60_000 * 15);

// Expiration date for verified emails is 30 days
const getEmailVerifiedExpirationDate = () =>
  new Date(Date.now() + 3600_000 * 24 * 30);

export const sendEmailVerificationProcedure = notAuthenticatedProcedureBuilder
  .input(
    z.object({
      email: z.string().email(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Check if there is already an email verification code for the given email
    const [existingUser, existingEmailVerificationCode] = await Promise.all([
      ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      }),
      ctx.prisma.emailVerificationCode.findUnique({
        where: {
          email: input.email,
        },
      }),
    ]);

    if (existingUser) {
      // TODO
      // we don't want to leak details that the email already exists for a user,
      // but we should still fail
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Email confirmation to ${input.email} failed to send.`,
      });
    }

    // If email already verified, throw error
    if (existingEmailVerificationCode?.emailConfirmed) {
      return {
        email: input.email,
        status: "ALREADY_VERIFIED" as const,
        message: `Email ${input.email} has already been verified`,
      };
    }

    // Send email. If sending fails, throw error.
    const emailCode = generateSixDigitCode();
    try {
      await sendEmailVerification(input.email, emailCode);
    } catch (error) {
      if (env.NODE_ENV === "development") {
        console.error(error);
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Email confirmation to ${input.email} failed to send.`,
          cause: error,
        });
      }
    }
    // Create/update the email verification code in the database
    const result = await ctx.prisma.emailVerificationCode.upsert({
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
      email: result.email,
      status: "EMAIL_SENT" as const,
      message: `Email verification code sent to ${result.email}`,
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
    // Check if there are existing entries for the given email
    const [existingUser, existingEmailVerificationCode] = await Promise.all([
      ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      }),
      ctx.prisma.emailVerificationCode.findUnique({
        where: {
          email: input.email,
        },
      }),
    ]);

    // If user already exists
    if (existingUser) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `${input.email} is not verified.`,
      });
    }

    // If email already verified
    if (existingEmailVerificationCode?.emailConfirmed) {
      return {
        status: "SUCCESS" as const,
        email: existingEmailVerificationCode.email,
        message: `Email was successfully verified. Email: ${input.email}.`,
      };
    }

    // If email verification not found or given code is wrong, throw UNAUTHORIZED error
    if (
      !existingEmailVerificationCode ||
      input.code !== existingEmailVerificationCode.code
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `${input.email} is not verified.`,
      });
    }

    // If given code is expired, send new verification code and return RESENT
    if (existingEmailVerificationCode.expiresAt < new Date()) {
      // Send email. If sending fails, throw error.
      const emailCode = generateSixDigitCode();
      try {
        await sendEmailVerification(input.email, emailCode);
      } catch (error) {
        if (env.NODE_ENV === "development") {
          console.error(error);
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Email confirmation to ${input.email} failed to resend.`,
            cause: error,
          });
        }
      }
      // Create/update the email verification code in the database
      const result = await ctx.prisma.emailVerificationCode.update({
        where: {
          email: input.email,
        },
        data: {
          code: emailCode,
          expiresAt: getNewEmailVerificationCodeExpirationDate(),
        },
      });

      return {
        status: "RESENT" as const,
        email: result.email,
        message: `Code is expired. A new code was sent to ${input.email}.`,
      };
    }

    // If here, the given code was valid, so we can update the emailVerificationCode.
    const result = await ctx.prisma.emailVerificationCode.update({
      where: {
        email: input.email,
      },
      data: {
        emailConfirmed: true,
        expiresAt: getEmailVerifiedExpirationDate(),
      },
    });

    return {
      status: "SUCCESS" as const,
      email: result.email,
      message: `Email was successfully verified. Email: ${input.email}.`,
    };
  });
