import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "@good-dog/env";

import { authenticatedProcedureBuilder } from "../middleware/authenticated";

// Expiration date for email verification codes is 15 minutes
const getNewEmailVerificationCodeExpirationDate = () =>
  new Date(Date.now() + 60_000 * 15);

// Expiration date for verified emails is 30 days
const getEmailVerifiedExpirationDate = () =>
  new Date(Date.now() + 3600_000 * 24 * 30);

export const sendEmailVerificationProcedure =
  authenticatedProcedureBuilder.mutation(async ({ ctx }) => {
    const inputEmail = ctx.session.user.email;
    // Check if there is already an email verification code for the given email
    const existingEmailVerificationCode =
      await ctx.prisma.emailVerificationCode.findUnique({
        where: {
          email: inputEmail,
        },
      });

    // If email already verified, throw error
    if (existingEmailVerificationCode?.emailConfirmed) {
      return {
        email: inputEmail,
        status: "ALREADY_VERIFIED" as const,
        message: `Email ${inputEmail} has already been verified`,
      };
    }

    // Send email. If sending fails, throw error.
    const emailCode = ctx.emailService.generateSixDigitCode();
    try {
      await ctx.emailService.sendVerificationEmail(inputEmail, emailCode);
    } catch (error) {
      if (env.NODE_ENV === "development") {
        console.error(error);
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Email confirmation to ${inputEmail} failed to send.`,
          cause: error,
        });
      }
    }
    // Create/update the email verification code in the database
    const result = await ctx.prisma.emailVerificationCode.upsert({
      where: {
        email: inputEmail,
      },
      update: {
        code: emailCode,
        expiresAt: getNewEmailVerificationCodeExpirationDate(),
      },
      create: {
        code: emailCode,
        email: inputEmail,
        expiresAt: getNewEmailVerificationCodeExpirationDate(),
      },
    });

    return {
      email: result.email,
      status: "EMAIL_SENT" as const,
      message: `Email verification code sent to ${result.email}`,
    };
  });

export const confirmEmailProcedure = authenticatedProcedureBuilder
  .input(
    z.object({
      code: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const inputEmail = ctx.session.user.email;
    // Check if there are existing entries for the given email
    const existingEmailVerificationCode =
      await ctx.prisma.emailVerificationCode.findUnique({
        where: {
          email: inputEmail,
        },
      });

    // If email already verified
    if (existingEmailVerificationCode?.emailConfirmed) {
      return {
        status: "SUCCESS" as const,
        email: existingEmailVerificationCode.email,
        message: `Email was successfully verified. Email: ${inputEmail}.`,
      };
    }

    // If email verification not found or given code is wrong, throw UNAUTHORIZED error
    if (
      !existingEmailVerificationCode ||
      input.code !== existingEmailVerificationCode.code
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `${inputEmail} is not verified.`,
      });
    }

    // If given code is expired, send new verification code and return RESENT
    if (existingEmailVerificationCode.expiresAt < new Date()) {
      // Send email. If sending fails, throw error.
      const emailCode = ctx.emailService.generateSixDigitCode();
      try {
        await ctx.emailService.sendVerificationEmail(inputEmail, emailCode);
      } catch (error) {
        if (env.NODE_ENV === "development") {
          console.error(error);
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Email confirmation to ${inputEmail} failed to resend.`,
            cause: error,
          });
        }
      }
      // Create/update the email verification code in the database
      const result = await ctx.prisma.emailVerificationCode.update({
        where: {
          email: inputEmail,
        },
        data: {
          code: emailCode,
          expiresAt: getNewEmailVerificationCodeExpirationDate(),
        },
      });

      return {
        status: "RESENT" as const,
        email: result.email,
        message: `Code is expired. A new code was sent to ${inputEmail}.`,
      };
    }

    // If here, the given code was valid, so we can update the emailVerificationCode.
    const result = await ctx.prisma.emailVerificationCode.update({
      where: {
        email: inputEmail,
      },
      data: {
        emailConfirmed: true,
        expiresAt: getEmailVerifiedExpirationDate(),
      },
    });

    return {
      status: "SUCCESS" as const,
      email: result.email,
      message: `Email was successfully verified. Email: ${result.email}.`,
    };
  });
