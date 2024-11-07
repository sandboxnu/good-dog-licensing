import { send, setApiKey } from "@good-dog/email/email-service";
import { env } from "@good-dog/env";

export async function sendEmailVerification(toEmail: string, code: string) {
  setApiKey(env.SENDGRID_API_KEY ?? "");

  const msg = {
    to: toEmail,
    subject: "Verify Your Email - Good Dog Licensing",
    html: `<p>Your Verification Code: <strong>${code}</strong></p>`,
  };

  return await send(msg, env.VERIFICATION_FROM_EMAIL ?? "");
}
