import { env } from "@good-dog/env";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

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
  private mailerSend: MailerSend;
  private sentFrom: Sender;
  constructor(apiKey?: string) {
    this.apiKey = apiKey;

    if (apiKey) {
      this.mailerSend = new MailerSend({ apiKey });
    } else {
      this.mailerSend = new MailerSend({ apiKey: "" });
    }

    this.sentFrom = new Sender(
      "message@test-p7kx4xwv6peg9yjr.mlsender.net",
      "Good Dog Licensing",
    );
  }

  generateSixDigitCode() {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
  }

  /**
   * Production environment on Vercel should redirect to the production URL.
   *
   * Any other vercel environment should redirect to the Vercel URL environment variable.
   *
   * If neither of those are set, we default to localhost:3000.
   */
  getBaseUrl() {
    if (env.VERCEL_ENV === "production") {
      return "https://good-dog-licensing.vercel.app";
    } else if (env.VERCEL_URL) {
      return `https://${env.VERCEL_URL}`;
    }

    return "http://localhost:3000";
  }

  async send(params: EmailParams) {
    if (!params.from.email) {
      throw new TypeError("Failed to send email: No from email provided.");
    }

    if (!this.apiKey) {
      throw new TypeError("Failed to send email: No api key provided.");
    }

    return this.mailerSend.email.send(params);
  }

  sendPasswordResetEmail(toEmail: string, cuid: string) {
    const baseURL = this.getBaseUrl();

    const emailParams = new EmailParams()
      .setFrom(this.sentFrom)
      .setTo([new Recipient(toEmail)])
      .setReplyTo(this.sentFrom)
      .setSubject("Reset Your Password - Good Dog Licensing")
      .setHtml(
        `<p>Follow <a href="${baseURL}/reset-password/?reset_id=${cuid}">this link</a> to reset your password.`,
      );

    return this.send(emailParams);
  }

  sendPRInviteEmail(toEmail: string, cuid: string) {
    const baseURL = this.getBaseUrl();

    const emailParams = new EmailParams()
      .setFrom(this.sentFrom)
      .setTo([new Recipient(toEmail)])
      .setReplyTo(this.sentFrom)
      .setSubject("Sign Up For P&R - Good Dog Licensing")
      .setHtml(
        `<p>Follow <a href="${baseURL}/pnr-invite/?id=${cuid}">this link</a> to sign up as a PR.`,
      );

    return this.send(emailParams);
  }

  sendVerificationEmail(toEmail: string, code: string) {
    const emailParams = new EmailParams()
      .setFrom(this.sentFrom)
      .setTo([new Recipient(toEmail)])
      .setReplyTo(this.sentFrom)
      .setSubject("Sign Up For P&R - Good Dog Licensing")
      .setHtml(
        `<p>Your Verification Code: <strong>${code}</strong></p>`,
      );

    return this.send(emailParams);
  }
}
