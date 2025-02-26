import sgMail from "@sendgrid/mail";

import { env } from "@good-dog/env";

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  from: string;
}

// These functions are an abstraction over the sgMail module from sendgrid. The main
// purpose is to throw runtime errors for blank api keys/from emails so we are alerted of
// the issue ahead of time.
export class EmailService {
  private apiKey?: string;
  constructor(apiKey?: string) {
    this.apiKey = apiKey;

    if (apiKey) {
      sgMail.setApiKey(apiKey);
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    sgMail.setApiKey(apiKey);
  }

  generateSixDigitCode() {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
  }

  async send(msg: EmailMessage) {
    if (!msg.from) {
      throw new TypeError("Failed to send email: No from email provided.");
    }

    if (!this.apiKey) {
      throw new TypeError("Failed to send email: No api key provided.");
    }

    return await sgMail.send(msg);
  }

  sendPasswordResetEmail(toEmail: string, cuid: string) {
    const baseURL = this.getBaseUrl();

    return this.send({
      to: toEmail,
      subject: "Reset Your Password - Good Dog Licensing",
      html: `<p>Follow <a href="${baseURL}/pwdreset/reset_id?=${cuid}">this link</a> to reset your password.`,
      from: env.VERIFICATION_FROM_EMAIL ?? "",
    });
  }

  sendPRInviteEmail(toEmail: string, cuid: string) {
    const baseURL = this.getBaseUrl();

    return this.send({
      to: toEmail,
      subject: "Sign Up For PR - Good Dog Licensing",
      html: `<p>Follow <a href="${baseURL}/pr_invite/?id=${cuid}">this link</a> to sign up as a PR.`,
      from: env.VERIFICATION_FROM_EMAIL ?? "",
    });
  }

  private getBaseUrl() {
    let baseURL = "http://localhost:3000";
    if (env.VERCEL_URL) {
      baseURL = `https://${env.VERCEL_URL}`;
    }

    return baseURL;
  }

  sendVerificationEmail(toEmail: string, code: string) {
    return this.send({
      to: toEmail,
      subject: "Verify Your Email - Good Dog Licensing",
      html: `<p>Your Verification Code: <strong>${code}</strong></p>`,
      from: env.VERIFICATION_FROM_EMAIL ?? "",
    });
  }
}
