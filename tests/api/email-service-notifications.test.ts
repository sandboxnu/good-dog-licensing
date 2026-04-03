import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { prisma } from "@good-dog/db";
import { env } from "@good-dog/env";

import {
  artistJoiningConfirmationTemplate,
  artistLicenseCompleteTemplate,
  artistMusicSubmissionConfirmationTemplate,
  artistSongRequestedForBriefTemplate,
} from "../../packages/email/src/templates/artistNotifications";
import {
  mediaMakerBriefSubmissionConfirmationTemplate,
  mediaMakerChatMessageTemplate,
  mediaMakerJoiningConfirmationTemplate,
  mediaMakerLicenseCompleteTemplate,
  mediaMakerMaterialRequestTemplate,
  mediaMakerProjectManagerAssignedTemplate,
  mediaMakerSongSuggestionByPMTemplate,
} from "../../packages/email/src/templates/mediaMakerNotifications";
import {
  adminAndPMChatMessageTemplate,
  adminAndPMLicenseSignedTemplate,
  adminAndPMMaterialsDeliveredTemplate,
  adminAndPNRBriefAvailableTemplate,
  adminAndPMSongSuggestionApprovedByMMTemplate,
  adminProjectManagerAssignedTemplate,
  adminSongSuggestionSentToMMTemplate,
  pmSongSuggestionAddedToBriefTemplate,
} from "../../packages/email/src/templates/staffNotifications";
import { MockEmailService } from "../mocks/MockEmailService";

describe("email service notification methods", () => {
  const mockEmail = new MockEmailService();

  const FROM = `Good Dog Licensing <${env.GOOD_DOG_FROM_EMAIL ?? ""}>`;
  const BASE_URL = "http://localhost:3000";

  beforeEach(async () => {
    await prisma.user.createMany({
      data: [
        {
          email: "admin1@test.com",
          phoneNumber: "1234567890",
          hashedPassword: "",
          firstName: "first",
          lastName: "last",
          role: "ADMIN",
          userId: "1",
        },
        {
          email: "mod1@test.com",
          phoneNumber: "1234567890",
          hashedPassword: "",
          firstName: "first",
          lastName: "last",
          role: "MODERATOR",
          userId: "2",
        },
      ],
    });
    mockEmail.clear();
  });

  afterEach(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: ["admin1@test.com", "mod1@test.com"] } },
    });
    mockEmail.clear();
  });

  // ── Artist Notifications ──────────────────────────────────────────────────

  describe("artist notifications", () => {
    test("sendArtistJoiningConfirmation calls send with correct params", async () => {
      await mockEmail.sendArtistJoiningConfirmation("artist@test.com");

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["artist@test.com"],
        subject: "Welcome to Good Dog Licensing!",
        html: artistJoiningConfirmationTemplate(),
      }, false);
    });

    test("sendArtistMusicSubmissionConfirmation calls send with correct params", async () => {
      await mockEmail.sendArtistMusicSubmissionConfirmation("artist@test.com");

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["artist@test.com"],
        subject: "Music Submitted — Thank You! - Good Dog Licensing",
        html: artistMusicSubmissionConfirmationTemplate(),
      }, false);
    });

    test("sendArtistSongRequestedForBrief calls send with correct params", async () => {
      await mockEmail.sendArtistSongRequestedForBrief(
        "artist@test.com",
        "My Song",
        "song123",
        "My Project",
      );

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["artist@test.com"],
        subject: "Your Song Has Been Requested - Good Dog Licensing",
        html: artistSongRequestedForBriefTemplate({
          songName: "My Song",
          projectName: "My Project",
          link: `${BASE_URL}/song/song123`,
        }),
      }, false);
    });

    test("sendArtistLicenseComplete calls send with correct params", async () => {
      await mockEmail.sendArtistLicenseComplete(
        "artist@test.com",
        "My Song",
        "My Project",
        "song123",
      );

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["artist@test.com"],
        subject: "License Complete — Good Dog Licensing",
        html: artistLicenseCompleteTemplate({
          songName: "My Song",
          projectName: "My Project",
          link: `${BASE_URL}/song/song123/contract`,
        }),
      }, false);
    });
  });

  // ── Media Maker Notifications ─────────────────────────────────────────────

  describe("media maker notifications", () => {
    test("sendMediaMakerJoiningConfirmation calls send with correct params", async () => {
      await mockEmail.sendMediaMakerJoiningConfirmation("mm@test.com");

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["mm@test.com"],
        subject: "Welcome to Good Dog Licensing!",
        html: mediaMakerJoiningConfirmationTemplate(),
      }, false);
    });

    test("sendMediaMakerBriefSubmissionConfirmation calls send with correct params", async () => {
      await mockEmail.sendMediaMakerBriefSubmissionConfirmation("mm@test.com");

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["mm@test.com"],
        subject: "Brief Submitted — Thank You! - Good Dog Licensing",
        html: mediaMakerBriefSubmissionConfirmationTemplate(),
      }, false);
    });

    test("sendMediaMakerProjectManagerAssigned calls send with correct params", async () => {
      await mockEmail.sendMediaMakerProjectManagerAssigned(
        "mm@test.com",
        "My Project",
        "John PM",
      );

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["mm@test.com"],
        subject: "Your Project Manager Has Been Assigned - Good Dog Licensing",
        html: mediaMakerProjectManagerAssignedTemplate({
          projectName: "My Project",
          projectManagerName: "John PM",
        }),
      }, false);
    });

    test("sendMediaMakerChatMessage calls send with correct params", async () => {
      await mockEmail.sendMediaMakerChatMessage(
        "mm@test.com",
        "My Project",
        "sr123",
      );

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["mm@test.com"],
        subject: "New Chat Message — My Project - Good Dog Licensing",
        html: mediaMakerChatMessageTemplate({
          projectName: "My Project",
          link: `${BASE_URL}/song-request/sr123`,
        }),
      }, false);
    });

    test("sendMediaMakerSongSuggestionByPM calls send with correct params", async () => {
      await mockEmail.sendMediaMakerSongSuggestionByPM(
        "mm@test.com",
        "My Song",
        "My Project",
        "sr123",
      );

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["mm@test.com"],
        subject:
          "New Song Suggestion from Your Project Manager - Good Dog Licensing",
        html: mediaMakerSongSuggestionByPMTemplate({
          songName: "My Song",
          projectName: "My Project",
          link: `${BASE_URL}/song-request/sr123`,
        }),
      }, false);
    });

    test("sendMediaMakerLicenseComplete calls send with correct params", async () => {
      await mockEmail.sendMediaMakerLicenseComplete(
        "mm@test.com",
        "My Song",
        "My Project",
        "sr123",
      );

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["mm@test.com"],
        subject: "License Complete — Congratulations! - Good Dog Licensing",
        html: mediaMakerLicenseCompleteTemplate({
          songName: "My Song",
          projectName: "My Project",
          link: `${BASE_URL}/song-request/sr123/contract`,
        }),
      }, false);
    });

    test("sendMediaMakerMaterialRequest calls send with correct params", async () => {
      await mockEmail.sendMediaMakerMaterialRequest("mm@test.com", "proj123");

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["mm@test.com"],
        subject: "Materials Needed for Your Project - Good Dog Licensing",
        html: mediaMakerMaterialRequestTemplate({
          link: `${BASE_URL}/project/proj123/materials`,
        }),
      }, false);
    });
  });

  // ── Staff Notifications ───────────────────────────────────────────────────

  describe("staff notifications", () => {
    test("sendAdminAndPNRBriefAvailable calls send with correct recipients and content", async () => {
      await mockEmail.sendAdminAndPNRBriefAvailable(
        "Media Maker",
        3,
        "My Project",
        "proj123",
      );

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["admin1@test.com", "mod1@test.com"],
        subject: "New Brief Available - Good Dog Licensing",
        html: adminAndPNRBriefAvailableTemplate({
          mediaMakerName: "Media Maker",
          songCount: 3,
          projectName: "My Project",
          link: `${BASE_URL}/home?projectId=proj123`,
        }),
      }, false);
    });

    test("sendAdminProjectManagerAssigned calls send with correct recipients and content", async () => {
      await mockEmail.sendAdminProjectManagerAssigned(
        "Admin Name",
        "PM Name",
        "My Project",
        "proj123",
      );

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["admin1@test.com"],
        subject: "Project Manager Assigned to Brief - Good Dog Licensing",
        html: adminProjectManagerAssignedTemplate({
          adminName: "Admin Name",
          pmName: "PM Name",
          projectName: "My Project",
          link: `${BASE_URL}/home?projectId=proj123`,
        }),
      }, false);
    });

    test("sendAdminAndPMChatMessage calls send with correct recipients and content", async () => {
      await mockEmail.sendAdminAndPMChatMessage("My Project", "sr123");

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["admin1@test.com", "mod1@test.com"],
        subject: "New Chat Message — My Project - Good Dog Licensing",
        html: adminAndPMChatMessageTemplate({
          projectName: "My Project",
          link: `${BASE_URL}/song-request/sr123`,
        }),
      }, false);
    });

    test("sendAdminAndPMSongSuggestionSentToMM calls send with correct recipients and content", async () => {
      await mockEmail.sendAdminAndPMSongSuggestionSentToMM(
        "Sender",
        "My Song",
        "Artist",
        "My Project",
        "sr123",
      );

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["admin1@test.com", "mod1@test.com"],
        subject: "Song Suggestion Sent to Media Maker - Good Dog Licensing",
        html: adminSongSuggestionSentToMMTemplate({
          senderName: "Sender",
          songName: "My Song",
          artistName: "Artist",
          projectName: "My Project",
          link: `${BASE_URL}/song-request/sr123`,
        }),
      }, false);
    });

    test("sendAdminAndPMSongSuggestionApprovedByMM calls send with correct recipients and content", async () => {
      await mockEmail.sendAdminAndPMSongSuggestionApprovedByMM(
        "Media Maker",
        "My Song",
        "Artist",
        "My Project",
        "sr123",
      );

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["admin1@test.com"],
        subject: "Song Suggestion Approved by Media Maker - Good Dog Licensing",
        html: adminAndPMSongSuggestionApprovedByMMTemplate({
          mediaMakerName: "Media Maker",
          songName: "My Song",
          artistName: "Artist",
          projectName: "My Project",
          link: `${BASE_URL}/song-request/sr123`,
        }),
      }, false);
    });

    test("sendAdminAndPMLicenseSigned calls send with correct recipients and content", async () => {
      await mockEmail.sendAdminAndPMLicenseSigned(
        "Media Maker",
        "Musician",
        "My Project",
        "sr123",
      );

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["admin1@test.com"],
        subject: "License Signed — Brief Complete - Good Dog Licensing",
        html: adminAndPMLicenseSignedTemplate({
          mediaMakerName: "Media Maker",
          musicianName: "Musician",
          projectName: "My Project",
          link: `${BASE_URL}/song-request/sr123/contract`,
        }),
      }, false);
    });

    test("sendAdminAndPMMaterialsDelivered calls send with correct recipients and content", async () => {
      await mockEmail.sendAdminAndPMMaterialsDelivered(
        "Media Maker",
        "My Project",
      );

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["admin1@test.com"],
        subject: "Materials Delivered - Good Dog Licensing",
        html: adminAndPMMaterialsDeliveredTemplate({
          mediaMakerName: "Media Maker",
          projectName: "My Project",
        }),
      }, false);
    });

    test("sendPMSongSuggestionAddedToBrief calls send with correct params", async () => {
      await mockEmail.sendPMSongSuggestionAddedToBrief(
        "pm@test.com",
        "PR Name",
        "My Song",
        "Artist",
        "My Project",
        "sr123",
      );

      expect(mockEmail.send).toHaveBeenCalledWith({
        from: FROM,
        to: ["pm@test.com"],
        subject: "New Song Suggestion Added to Brief - Good Dog Licensing",
        html: pmSongSuggestionAddedToBriefTemplate({
          prName: "PR Name",
          songName: "My Song",
          artistName: "Artist",
          projectName: "My Project",
          link: `${BASE_URL}/song-request/sr123`,
        }),
      }, false);
    });
  });
});
