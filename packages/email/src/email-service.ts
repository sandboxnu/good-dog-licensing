import sgMail from "@sendgrid/mail";

// These functions are an abstraction over the sgMail module from sendgrid. The main
// purpose is to throw runtime errors for blank api keys/from emails so we are alerted of
// the issue ahead of time.

export function setApiKey(apiKey: string) {
  if (!apiKey) {
    throw new TypeError("Invalid api key: Expected a non-empty string.");
  }

  sgMail.setApiKey(apiKey);
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}

export async function send(msg: EmailMessage, fromEmail?: string) {
  if (!fromEmail) {
    throw new TypeError("Invalid from email: Expected a non-empty string.");
  }

  return await sgMail.send({ ...msg, from: fromEmail });
}

// Generate 6 digit code. For example: 712364.
export function generateSixDigitCode() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}
