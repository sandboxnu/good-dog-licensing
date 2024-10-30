import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

// TODO: Implement this later?
// import { env } from "../../../apps/web/env";

export async function sendEmailVerification(
  toEmail: string,
  code: string,
): Promise<boolean> {
  // TODO: Implement this later?
  // sgMail.setApiKey(env.SENDGRID_API_KEY);

  // This code is just for using dotenv, should be removed later
  dotenv.config({ path: "../.env" });
  const sendGridAPIKey = process.env.SENDGRID_API_KEY;
  if (sendGridAPIKey === undefined) {
    console.log("Undefined");
    return false;
  }
  sgMail.setApiKey(sendGridAPIKey);
  // End here

  const msg = {
    to: toEmail,
    from: "jordanpraissman@gmail.com",
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

void sendEmailVerification("jordanpraissman@gmail.com", "123456");
