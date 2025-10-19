import { env } from "@good-dog/env";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { prisma } from "@good-dog/db";

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  from: string;
}

// These functions are an abstraction over the mailersend module from MailerSend. The main
// purpose is to throw runtime errors for blank api keys/from emails so we are alerted of
// the issue ahead of time.
export class EmailService {
  private apiKey?: string;
  private mailerSend: MailerSend;
  private sentFrom: Sender;
  constructor(apiKey?: string) {
    this.apiKey = apiKey;

    this.mailerSend = new MailerSend({ apiKey: apiKey ?? "" });

    this.sentFrom = new Sender(
      env.GOOD_DOG_FROM_EMAIL ?? "",
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

  private async getAllAdminAndPNREmails(): Promise<string[]> {
    return (
      await prisma.user.findMany({
        where: {
          role: {
            in: ["ADMIN", "MODERATOR"],
          },
        },
        select: {
          email: true,
        },
      })
    ).map((user) => user.email);
  }

  async send(params: EmailParams) {
    // if (!params.from.email) {
    //   throw new TypeError("Failed to send email: No from email provided.");
    // }
    // if (!this.apiKey) {
    //   throw new TypeError("Failed to send email: No api key provided.");
    // }
    // return this.mailerSend.email.send(params);
    if (params.cc) {
      return;
    }
    return;
  }

  async sendPasswordResetEmail(toEmail: string, cuid: string) {
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

  async sendPRInviteEmail(toEmail: string, cuid: string) {
    const baseURL = this.getBaseUrl();

    const emailParams = new EmailParams()
      .setFrom(this.sentFrom)
      .setTo([new Recipient(toEmail)])
      .setReplyTo(this.sentFrom)
      .setSubject("Sign Up to be a P&R - Good Dog Licensing")
      .setHtml(
        `<p>Follow <a href="${baseURL}/pnr-invite/?id=${cuid}">this link</a> to sign up as a PR.`,
      );

    return this.send(emailParams);
  }

  async sendVerificationEmail(toEmail: string, code: string) {
    const emailParams = new EmailParams()
      .setFrom(this.sentFrom)
      .setTo([new Recipient(toEmail)])
      .setReplyTo(this.sentFrom)
      .setSubject("Verify Your Email - Good Dog Licensing")
      .setHtml(`<p>Your Verification Code: <strong>${code}</strong></p>`);

    return this.send(emailParams);
  }

  async notifyInternalUsersNewMusicSubmitted(musicSubmissionId: string) {
    const baseURL = this.getBaseUrl();

    const toEmails = await this.getAllAdminAndPNREmails();

    const emailParams = new EmailParams()
      .setFrom(this.sentFrom)
      .setTo(toEmails.map((email) => new Recipient(email)))
      .setReplyTo(this.sentFrom)
      .setSubject("New Music Submission - Good Dog Licensing")
      .setHtml(
        `<p>A new music submission has been made. Review it <a href="${baseURL}/dashboard/songs/?id=${musicSubmissionId}">here</a>.</p>`,
      );

    return this.send(emailParams);
  }

  async notifyInternalUsersNewProjectSubmitted(projectSubmissionId: string) {
    const baseURL = this.getBaseUrl();

    const toEmails = await this.getAllAdminAndPNREmails();

    const emailParams = new EmailParams()
      .setFrom(this.sentFrom)
      .setTo(toEmails.map((email) => new Recipient(email)))
      .setReplyTo(this.sentFrom)
      .setSubject("New Project Submission - Good Dog Licensing")
      .setHtml(
        `<p>A new project submission has been made. Review it <a href="${baseURL}/dashboard/projects/?id=${projectSubmissionId}">here</a>.</p>`,
      );

    return this.send(emailParams);
  }
}
