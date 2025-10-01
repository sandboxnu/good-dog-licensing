import { TRPCError } from "@trpc/server";

import type { EmailService } from "@good-dog/email";
import { env } from "@good-dog/env";

// Expiration date for email verification codes is 15 minutes
export const getEmailVerificationCodeExpirationDate = () =>
  new Date(Date.now() + 60_000 * 15);

// Returns email code if email was sent successfully
export const sendVerificationEmailHelper = async (
  emailService: EmailService,
  email: string,
): Promise<string> => {
  const emailCode = emailService.generateSixDigitCode();

  try {
    await emailService.sendVerificationEmail(email, emailCode);
  } catch (error) {
    if (env.NODE_ENV === "development") {
      console.error(error);
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Email confirmation to ${email} failed to send.`,
        cause: error,
      });
    }
  }

  return emailCode;
};
