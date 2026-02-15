import { Resend } from "resend";

import { prisma } from "@good-dog/db";
import { env } from "@good-dog/env";

export interface EmailMessage {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

// These functions are an abstraction over the resend module from Resend. The main
// purpose is to throw runtime errors for blank api keys/from emails so we are alerted of
// the issue ahead of time.
export class EmailService {
  private apiKey?: string;
  private resend: Resend;
  private sentFrom: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;

    this.resend = new Resend(apiKey ?? "re_123");

    this.sentFrom = `Good Dog Licensing <${env.GOOD_DOG_FROM_EMAIL ?? ""}>`;
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

  async send(params: EmailMessage) {
    if (!this.apiKey) {
      throw new TypeError("Failed to send email: No api key provided.");
    }

    if (params.to.length == 0) {
      console.log("There are no internal users to notify of new submission.");
      return;
    }

    const { data, error } = await this.resend.emails.send(params);

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
  }

  async sendPasswordResetEmail(toEmail: string, cuid: string) {
    const baseURL = this.getBaseUrl();

    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: "Reset Your Password - Good Dog Licensing",
      html: `<p>Follow <a href="${baseURL}/reset-password/?reset_id=${cuid}">this link</a> to reset your password.</p>`,
    };

    return this.send(params);
  }

  async sendPRInviteEmail(toEmail: string, cuid: string) {
    const baseURL = this.getBaseUrl();

    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: "Sign Up to be a P&R - Good Dog Licensing",
      html: `<p>Follow <a href="${baseURL}/pnr-invite/?id=${cuid}">this link</a> to sign up as a PR.</p>`,
    };

    return this.send(params);
  }

  async sendVerificationEmail(toEmail: string, code: string) {
    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: "Verify Your Email - Good Dog Licensing",
      html: `<p>Your Verification Code: <strong>${code}</strong></p>`,
    };

    return this.send(params);
  }

  async notifyInternalUsersNewMusicSubmitted(musicSubmissionId: string) {
    const baseURL = this.getBaseUrl();

    const toEmails = await this.getAllAdminAndPNREmails();

    const params: EmailMessage = {
      from: this.sentFrom,
      to: toEmails,
      subject: "New Music Submission - Good Dog Licensing",
      html: `<p>A new music submission has been made. Review it <a href="${baseURL}/dashboard/songs/?id=${musicSubmissionId}">here</a>.</p>`,
    };

    return this.send(params);
  }

  async notifyInternalUsersNewProjectSubmitted(projectSubmissionId: string) {
    const baseURL = this.getBaseUrl();

    const toEmails = await this.getAllAdminAndPNREmails();

    const params: EmailMessage = {
      from: this.sentFrom,
      to: toEmails,
      subject: "New Project Submission - Good Dog Licensing",
      html: `<p>A new project submission has been made. Review it <a href="${baseURL}/dashboard/projects/?id=${projectSubmissionId}">here</a>.</p>`,
    };

    return this.send(params);
  }
}
