import sgMail from "@sendgrid/mail";

import { env } from "@good-dog/env";

export async function sendEmailVerification(
  toEmail: string,
  code: string,
): Promise<boolean> {
  sgMail.setApiKey(env.SENDGRID_API_KEY ?? "");

  const msg = {
    to: toEmail,
    from: env.VERIFICATION_FROM_EMAIL ?? "",
    subject: "Verify Your Email - Good Dog Licensing",
    html: `<p>Your Verification Code: <strong>${code}</strong></p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
    return false;
  }

  return true;
}
