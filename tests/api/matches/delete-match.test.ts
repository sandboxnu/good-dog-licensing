import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "bun:test";

import { passwordService } from "@good-dog/auth/password";
import { Genre, MatchState, prisma, ProjectType } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCache } from "../../mocks/MockNextCache";
import { MockNextCookies } from "../../mocks/MockNextCookies";
import { createMockCookieService } from "../../mocks/util";

async function createData() {
  // Create a moderator
  await prisma.user.create({
    data: {
      userId: "moderator",
      firstName: "Amoli",
      lastName: "Patel",
      role: "MODERATOR",
      phoneNumber: "1234556789",
      email: "amolipatel@gmail.com",
      hashedPassword: await passwordService.hashPassword("amoliIsTheBest"),
      sessions: {
        create: {
          sessionId: "moderator-session-id",
          expiresAt: new Date(Date.now() + 5_000_000_000),
        },
      },
    },
  });

  // Create a musician
  const musician = await prisma.user.create({
    data: {
      userId: "musician",
      firstName: "Ameeka",
      lastName: "Patel",
      role: "MUSICIAN",
      phoneNumber: "2234567890",
      email: "ameekapatel@gmail.com",
      hashedPassword: await passwordService.hashPassword("amoliIsBetter"),
      sessions: {
        create: {
          sessionId: "musician-session-id",
          expiresAt: new Date(Date.now() + 5_000_000_000),
        },
      },
    },
  });

  // Create a media maker
  const projectOwner = await prisma.user.create({
    data: {
      userId: "mediamaker",
      firstName: "Gavin",
      lastName: "Normand",
      role: "MEDIA_MAKER",
      phoneNumber: "3234567890",
      email: "gavinnormand@gmail.com",
      hashedPassword: await passwordService.hashPassword("6767676767"),
      sessions: {
        create: {
          sessionId: "mediamaker-session-id",
          expiresAt: new Date(Date.now() + 5_000_000_000),
        },
      },
    },
  });

  // Create a music submission
  await prisma.musicSubmission.create({
    data: {
      musicId: "musicSubmission",
      songName: "3005",
      songLink:
        "https://open.spotify.com/track/2X6b7zLdIxCejd6GqVcQ9M?si=b36f9306fab04109",
      genres: [Genre.HIP_HOP],
      submitterId: musician.userId,
      performerName: "Twinsies",
    },
  });

  // Create a project submission
  const projectSubmission = await prisma.projectSubmission.create({
    data: {
      projectId: "climateChangeSubmission",
      projectOwnerId: projectOwner.userId,
      projectTitle: "title",
      description: "a project hoping to showcase the effects of climate change",
      deadline: new Date(Date.now() + 2_000_000_000),
      projectType: ProjectType.MOTION_PICTURE,
    },
  });

  // Create a song request
  await prisma.songRequest.create({
    data: {
      songRequestTitle: "Save the Earth",
      songRequestId: "songRequestOneSubmission",
      description: "wildfires in CA",
      feelingsConveyed: "rnb, soul",
      projectId: projectSubmission.projectId,
      similarSongs: "Let It Be",
    },
  });

  await prisma.user.create({
    data: {
      userId: "admin",
      firstName: "Jay",
      lastName: "Pee",
      role: "ADMIN",
      phoneNumber: "4234567890",
      email: "shoutoutjp@gmail.com",
      hashedPassword: await passwordService.hashPassword("password123"),
      sessions: {
        create: {
          sessionId: "admin-session-id",
          expiresAt: new Date(Date.now() + 5_000_000_000),
        },
      },
    },
  });
}

async function deleteData() {
  await prisma.comments.deleteMany({
    where: { songRequestId: "songRequestOneSubmission" },
  });

  // Some tests may set a manual matchId; both cleanups are kept
  await prisma.match.deleteMany({ where: { matchId: "match" } });
  await prisma.match.deleteMany({
    where: { songRequestId: "songRequestOneSubmission" },
  });

  await prisma.songRequest.deleteMany({
    where: { songRequestId: "songRequestOneSubmission" },
  });
  await prisma.projectSubmission.deleteMany({
    where: { projectId: "climateChangeSubmission" },
  });
  await prisma.musicSubmission.deleteMany({
    where: { musicId: "musicSubmission" },
  });
  await prisma.user.deleteMany({
    where: {
      userId: { in: ["moderator", "musician", "mediamaker", "admin"] },
    },
  });
}

describe("deleteMatch procedure", () => {
  const cookies = new MockNextCookies();
  const cache = new MockNextCache();

  beforeAll(async () => {
    await cache.apply();
  });

  beforeEach(async () => {
    await createData();

    // Create a match to be deleted
    await prisma.match.create({
      data: {
        songRequestId: "songRequestOneSubmission",
        musicId: "musicSubmission",
        matchState: MatchState.NEW,
        matcherUserId: "moderator",
      },
    });
  });

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(cookies),
    prisma,
  });

  afterEach(async () => {
    await deleteData();
    cookies.clear();
    cache.clear();
  });

  it("An admin can delete a match", async () => {
    cookies.set("sessionId", "admin-session-id");

    const response = await $api.deleteMatch({
      matchId: "match",
    });

    expect(response.message).toEqual("Match successfully deleted.");

    // Verify that the match no longer exists
    const shouldBeEmptyMatch = await prisma.match.findFirst({
      where: {
        matchId: "match",
      },
    });
    expect(shouldBeEmptyMatch).toBeNull();
  });

  it("A moderator can delete a match", async () => {
    cookies.set("sessionId", "moderator-session-id");

    const response = await $api.deleteMatch({
      matchId: "match",
    });

    expect(response.message).toEqual("Match successfully deleted.");

    // Verify that the match no longer exists
    const shouldBeEmptyMatch = await prisma.match.findFirst({
      where: {
        matchId: "match",
      },
    });
    expect(shouldBeEmptyMatch).toBeNull();
  });

  it("A musican can NOT delete a match", async () => {
    cookies.set("sessionId", "musician-session-id");
    expect(
      $api.deleteMatch({
        matchId: "match",
      }),
    ).rejects.toThrow("permission to modify");

    // Verify that the match still exists
    const match = await prisma.match.findFirst({
      where: {
        musicId: "musicSubmission",
      },
    });
    expect(match).toBeDefined();
  });

  it("A media-maker can NOT delete a match", async () => {
    cookies.set("sessionId", "mediamaker-session-id");
    expect(
      $api.deleteMatch({
        matchId: "match",
      }),
    ).rejects.toThrow("permission to modify");

    // Verify that the match still exists
    const match = await prisma.match.findFirst({
      where: {
        musicId: "musicSubmission",
      },
    });
    expect(match).toBeDefined();
  });
});
