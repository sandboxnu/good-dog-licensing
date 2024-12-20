import { send, setApiKey } from "@good-dog/email/email-service";
import { env } from "@good-dog/env";

export async function sendPasswordResetEmail(toEmail: string, cuid: string) {
  setApiKey(env.SENDGRID_API_KEY ?? "");

  let baseURL = "http://localhost:3000";
  if (env.VERCEL_URL) {
    baseURL = `https://${env.VERCEL_URL}`;
  }

  const msg = {
    to: toEmail,
    subject: "Reset Your Password - Good Dog Licensing",
    html: `<p>Follow <a href="${baseURL}/pwdreset/reset_id?=${cuid}">this link</a> to reset your password.`,
  };

  return await send(msg, env.VERIFICATION_FROM_EMAIL ?? "");
}
