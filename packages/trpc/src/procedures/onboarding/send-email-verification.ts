import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { notAuthenticatedProcedureBuilder } from "../../middleware/not-authenticated";
import { sendEmailHelper } from "../../utils";

// Expiration date for email verification codes is 15 minutes
export const getEmailVerificationCodeExpirationDate = () =>
  new Date(Date.now() + 60_000 * 15);

export const sendEmailVerificationProcedure = notAuthenticatedProcedureBuilder
  .input(z.object({ email: z.email() }))
  .mutation(async ({ ctx, input }) => {
    // Check if there is an existing user with the given email
    const existingUserWithEmail = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingUserWithEmail) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `User already exists with email ${input.email}`,
      });
    }

    // Send email
    const emailCode = ctx.emailService.generateSixDigitCode();
    const sendEmailCallback = async () =>
      await ctx.emailService.sendVerificationEmail(input.email, emailCode);
    await sendEmailHelper(
      sendEmailCallback,
      `Email confirmation to ${input.email} failed to send.`,
    );

    // Create/update the email verification code in the database
    const result = await ctx.prisma.emailVerificationCode.upsert({
      where: {
        email: input.email,
      },
      update: {
        code: emailCode,
        expiresAt: getEmailVerificationCodeExpirationDate(),
      },
      create: {
        code: emailCode,
        email: input.email,
        expiresAt: getEmailVerificationCodeExpirationDate(),
      },
    });

    return {
      email: result.email,
      status: "EMAIL_SENT" as const,
      message: `Email verification code sent to ${result.email}`,
    };
  });
