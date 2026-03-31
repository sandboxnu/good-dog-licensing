import { Resend } from "resend";

import { prisma } from "@good-dog/db";
import { env } from "@good-dog/env";
import { passwordResetTemplate } from "./templates/passswordReset";
import { emailVerificationTemplate } from "./templates/emailVerification";
import { pnrInviteTemplate } from "./templates/pnrInvite";
import {
  artistJoiningConfirmationTemplate,
  artistMusicSubmissionConfirmationTemplate,
  artistSongRequestedForBriefTemplate,
  artistLicenseCompleteTemplate,
} from "./templates/artistNotifications";
import {
  adminAndPNRBriefAvailableTemplate,
  adminProjectManagerAssignedTemplate,
  adminAndPMChatMessageTemplate,
  adminSongSuggestionSentToMMTemplate,
  adminAndPMSongSuggestionApprovedByMMTemplate,
  adminAndPMMaterialsDeliveredTemplate,
  pmSongSuggestionAddedToBriefTemplate,
  adminAndPMLicenseSignedTemplate,
} from "./templates/staffNotifications";
import {
  mediaMakerJoiningConfirmationTemplate,
  mediaMakerBriefSubmissionConfirmationTemplate,
  mediaMakerProjectManagerAssignedTemplate,
  mediaMakerChatMessageTemplate,
  mediaMakerSongSuggestionByPMTemplate,
  mediaMakerLicenseCompleteTemplate,
  mediaMakerMaterialRequestTemplate,
} from "./templates/mediaMakerNotifications";

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
      // if this starts failing, we probably need to add ctx. before it (pass context in as argument)
      (
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
      ).map((user) => user.email)
    );
  }

  private async getAllAdminEmails(): Promise<string[]> {
    return (
      // if this starts failing, we probably need to add ctx. before it (pass context in as argument)
      (
        await prisma.user.findMany({
          where: {
            role: {
              equals: "ADMIN",
            },
          },
          select: {
            email: true,
          },
        })
      ).map((user) => user.email)
    );
  }

  private async getAllPNREmails(): Promise<string[]> {
    return (
      await prisma.user.findMany({
        where: {
          role: {
            equals: "MODERATOR",
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

    if (params.to.length === 0) {
      console.error("There are no internal users to notify of new submission.");
      return;
    }

    const { data, error } = await this.resend.emails.send(params);

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
  }

  async sendVerificationEmail(toEmail: string, code: string) {
    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: "Verify Your Email - Good Dog Licensing",
      html: emailVerificationTemplate({
        code: code,
      }),
    };

    return this.send(params);
  }

  async sendPasswordResetEmail(toEmail: string, cuid: string) {
    const baseURL = this.getBaseUrl();
    const link = `${baseURL}/reset-password/?reset_id=${cuid}`;

    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: "Reset Your Password - Good Dog Licensing",
      html: passwordResetTemplate({
        resetLink: link,
      }),
    };

    return this.send(params);
  }

  async sendPRInviteEmail(toEmail: string, cuid: string) {
    const baseURL = this.getBaseUrl();
    const link = `${baseURL}/pnr-invite/?id=${cuid}`;

    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: "Sign Up to be a P&R - Good Dog Licensing",
      html: pnrInviteTemplate({
        inviteLink: link,
      }),
    };

    return this.send(params);
  }

  // ── Artist Notifications ────────────────────────────────────────────────────

  async sendArtistJoiningConfirmation(toEmail: string) {
    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: "Welcome to Good Dog Licensing!",
      html: artistJoiningConfirmationTemplate(),
    };

    return this.send(params);
  }

  async sendArtistMusicSubmissionConfirmation(toEmail: string) {
    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: "Music Submitted — Thank You! - Good Dog Licensing",
      html: artistMusicSubmissionConfirmationTemplate(),
    };

    return this.send(params);
  }

  async sendArtistSongRequestedForBrief(
    toEmail: string,
    songName: string,
    songId: string,
    projectName: string,
  ) {
    const baseURL = this.getBaseUrl();
    const link = `${baseURL}/song/${songId}`;

    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: `Your Song Has Been Requested - Good Dog Licensing`,
      html: artistSongRequestedForBriefTemplate({
        songName,
        projectName,
        link,
      }),
    };

    return this.send(params);
  }

  async sendArtistLicenseComplete(
    toEmail: string,
    songName: string,
    projectName: string,
    songId: string,
  ) {
    const baseURL = this.getBaseUrl();
    const link = `${baseURL}/song/${songId}/license`;

    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: "License Complete — Good Dog Licensing",
      html: artistLicenseCompleteTemplate({ songName, projectName, link }),
    };

    return this.send(params);
  }

  // ── Media Maker Notifications ───────────────────────────────────────────────
  
  async sendMediaMakerJoiningConfirmation(toEmail: string) {
    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: "Welcome to Good Dog Licensing!",
      html: mediaMakerJoiningConfirmationTemplate(),
    };

    return this.send(params);
  }

  async sendMediaMakerBriefSubmissionConfirmation(toEmail: string) {
    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: "Brief Submitted — Thank You! - Good Dog Licensing",
      html: mediaMakerBriefSubmissionConfirmationTemplate(),
    };

    return this.send(params);
  }

  async sendMediaMakerProjectManagerAssigned(
    toEmail: string,
    projectName: string,
    projectManagerName: string,
  ) {
    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: "Your Project Manager Has Been Assigned - Good Dog Licensing",
      html: mediaMakerProjectManagerAssignedTemplate({
        projectName,
        projectManagerName,
      }),
    };

    return this.send(params);
  }
  
  async sendMediaMakerChatMessage(
    toEmail: string,
    projectName: string,
    songRequestId: string,
  ) {
    const baseURL = this.getBaseUrl();
    const link = `${baseURL}/song-request/${songRequestId}`;

    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: `New Chat Message — ${projectName} - Good Dog Licensing`,
      html: mediaMakerChatMessageTemplate({ projectName, link }),
    };

    return this.send(params);
  }
  
  async sendMediaMakerSongSuggestionByPM(
    toEmail: string,
    songName: string,
    projectName: string,
    songRequestId: string,
  ) {
    const baseURL = this.getBaseUrl();
    const link = `${baseURL}/song-request/${songRequestId}`;

    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject:
        "New Song Suggestion from Your Project Manager - Good Dog Licensing",
      html: mediaMakerSongSuggestionByPMTemplate({
        songName,
        projectName,
        link,
      }),
    };

    return this.send(params);
  }
  
  async sendMediaMakerLicenseComplete(
    toEmail: string,
    songName: string,
    projectName: string,
    songRequestId: string,
  ) {
    const baseURL = this.getBaseUrl();
    const link = `${baseURL}/song-request/${songRequestId}/license`;

    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: "License Complete — Congratulations! - Good Dog Licensing",
      html: mediaMakerLicenseCompleteTemplate({ songName, projectName, link }),
    };

    return this.send(params);
  }

  //TODO
  async sendMediaMakerMaterialRequest(toEmail: string, projectId: string) {
    const baseURL = this.getBaseUrl();
    const link = `${baseURL}/project/${projectId}/materials`;

    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: "Materials Needed for Your Project - Good Dog Licensing",
      html: mediaMakerMaterialRequestTemplate({ link }),
    };

    return this.send(params);
  }

  // ── Staff Notifications ─────────────────────────────────────────────────────
  
  async sendAdminAndPNRBriefAvailable(
    mediaMakerName: string,
    songCount: number,
    projectName: string,
    projectId: string,
  ) {
    const baseURL = this.getBaseUrl();
    const link = `${baseURL}/dashboard/projects/?id=${projectId}`;
    const toEmails = await this.getAllAdminAndPNREmails();

    const params: EmailMessage = {
      from: this.sentFrom,
      to: toEmails,
      subject: "New Brief Available - Good Dog Licensing",
      html: adminAndPNRBriefAvailableTemplate({
        mediaMakerName,
        songCount,
        projectName,
        link,
      }),
    };

    return this.send(params);
  }
  
  async sendAdminProjectManagerAssigned(
    adminName: string,
    pmName: string,
    projectName: string,
    projectId: string,
  ) {
    const baseURL = this.getBaseUrl();
    const link = `${baseURL}/dashboard/projects/?id=${projectId}`;
    const toEmails = await this.getAllAdminEmails();

    const params: EmailMessage = {
      from: this.sentFrom,
      to: toEmails,
      subject: "Project Manager Assigned to Brief - Good Dog Licensing",
      html: adminProjectManagerAssignedTemplate({
        adminName,
        pmName,
        projectName,
        link,
      }),
    };

    return this.send(params);
  }
  
  async sendAdminAndPMChatMessage(
    projectName: string,
    songRequestId: string,
    pmEmail?: string,
  ) {
    const baseURL = this.getBaseUrl();
    const link = `${baseURL}/song-request/${songRequestId}`;
    const toEmails = [
      ...(await this.getAllAdminAndPNREmails()).filter((e) => e !== pmEmail),
      ...(pmEmail ? [pmEmail] : []),
    ];

    const params: EmailMessage = {
      from: this.sentFrom,
      to: toEmails,
      subject: `New Chat Message — ${projectName} - Good Dog Licensing`,
      html: adminAndPMChatMessageTemplate({ projectName, link }),
    };

    return this.send(params);
  }
  
  async sendAdminAndPMSongSuggestionSentToMM(
    senderName: string,
    songName: string,
    artistName: string,
    projectName: string,
    projectId: string,
    pmEmail?: string,
  ) {
    const baseURL = this.getBaseUrl();
    const link = `${baseURL}/dashboard/projects/?id=${projectId}`;
    const toEmails = [
      ...(await this.getAllAdminAndPNREmails()).filter((e) => e !== pmEmail),
      ...(pmEmail ? [pmEmail] : []),
    ];

    const params: EmailMessage = {
      from: this.sentFrom,
      to: toEmails,
      subject: "Song Suggestion Sent to Media Maker - Good Dog Licensing",
      html: adminSongSuggestionSentToMMTemplate({
        senderName,
        songName,
        artistName,
        projectName,
        link,
      }),
    };

    return this.send(params);
  }
  
  async sendAdminAndPMSongSuggestionApprovedByMM(
    mediaMakerName: string,
    songName: string,
    artistName: string,
    projectName: string,
    projectId: string,
    pmEmail?: string,
  ) {
    const baseURL = this.getBaseUrl();
    const link = `${baseURL}/dashboard/projects/?id=${projectId}`;
    const toEmails = [
      ...(await this.getAllAdminEmails()).filter((e) => e !== pmEmail),
      ...(pmEmail ? [pmEmail] : []),
    ];

    const params: EmailMessage = {
      from: this.sentFrom,
      to: toEmails,
      subject: "Song Suggestion Approved by Media Maker - Good Dog Licensing",
      html: adminAndPMSongSuggestionApprovedByMMTemplate({
        mediaMakerName,
        songName,
        artistName,
        projectName,
        link,
      }),
    };

    return this.send(params);
  }
  
  async sendAdminAndPMLicenseSigned(
    mediaMakerName: string,
    musicianName: string,
    projectName: string,
    songRequestId: string,
    pmEmail?: string,
  ) {
    const baseURL = this.getBaseUrl();
    const link = `${baseURL}/song-request/${songRequestId}/license`;
    const toEmails = [
      ...(await this.getAllAdminEmails()).filter((e) => e !== pmEmail),
      ...(pmEmail ? [pmEmail] : []),
    ];

    const params: EmailMessage = {
      from: this.sentFrom,
      to: toEmails,
      subject: "License Signed — Brief Complete - Good Dog Licensing",
      html: adminAndPMLicenseSignedTemplate({
        mediaMakerName,
        musicianName,
        projectName,
        link,
      }),
    };

    return this.send(params);
  }

  //TODO
  async sendAdminAndPMMaterialsDelivered(
    mediaMakerName: string,
    projectName: string,
    pmEmail?: string,
  ) {
    const toEmails = [
      ...(await this.getAllAdminEmails()).filter((e) => e !== pmEmail),
      ...(pmEmail ? [pmEmail] : []),
    ];
    const params: EmailMessage = {
      from: this.sentFrom,
      to: toEmails,
      subject: "Materials Delivered - Good Dog Licensing",
      html: adminAndPMMaterialsDeliveredTemplate({
        mediaMakerName,
        projectName,
      }),
    };

    return this.send(params);
  }
  
  async sendPMSongSuggestionAddedToBrief(
    toEmail: string,
    prName: string,
    songName: string,
    artistName: string,
    projectName: string,
    projectId: string,
  ) {
    const baseURL = this.getBaseUrl();
    const link = `${baseURL}/dashboard/projects/?id=${projectId}`;

    const params: EmailMessage = {
      from: this.sentFrom,
      to: [toEmail],
      subject: "New Song Suggestion Added to Brief - Good Dog Licensing",
      html: pmSongSuggestionAddedToBriefTemplate({
        prName,
        songName,
        artistName,
        projectName,
        link,
      }),
    };

    return this.send(params);
  }
}
