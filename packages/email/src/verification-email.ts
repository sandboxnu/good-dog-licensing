import emailService from "@good-dog/email/email-service";
import { env } from "@good-dog/env";

export async function sendEmailVerification(
  toEmail: string,
  code: string,
): Promise<boolean> {
  emailService.setApiKey(env.SENDGRID_API_KEY ?? "");

  const msg = {
    to: toEmail,
    from: env.VERIFICATION_FROM_EMAIL ?? "",
    subject: "Verify Your Email - Good Dog Licensing",
    html: `<p>Your Verification Code: <strong>${code}</strong></p>`,
  };

  return await emailService.send(msg);
}