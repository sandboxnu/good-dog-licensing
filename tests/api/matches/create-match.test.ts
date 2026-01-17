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
  await prisma.user.create({
    data: {
      userId: "matcher",
      firstName: "Jane",
      lastName: "Doe",
      role: "MODERATOR",
      phoneNumber: "1234556789",
      email: "bestmod123@gmail.com",
      hashedPassword: await passwordService.hashPassword("passcodeispasscode"),
      sessions: {
        create: {
          sessionId: "moderator-session-id",
          expiresAt: new Date(Date.now() + 5_000_000_000),
        },
      },
    },
  });

  const musician = await prisma.user.create({
    data: {
      userId: "musician",
      firstName: "ABCDEF",
      lastName: "ABCDEF",
      role: "MUSICIAN",
      phoneNumber: "2234567890",
      email: "musician@gmail.com",
      hashedPassword: await passwordService.hashPassword("password123"),
      sessions: {
        create: {
          sessionId: "musician-session-id",
          expiresAt: new Date(Date.now() + 5_000_000_000),
        },
      },
    },
  });

  await prisma.musicSubmission.create({
    data: {
      musicId: "musicSubmission",
      songName: "3005",
      songLink:
        "https://open.spotify.com/track/2X6b7zLdIxCejd6GqVcQ9M?si=b36f9306fab04109",
      genres: [Genre.HIP_HOP],
      submitterId: musician.userId,
      performerName: "The Beatles",
    },
  });

  const projectOwner = await prisma.user.create({
    data: {
      userId: "projectOwner",
      firstName: "Project",
      lastName: "Owner",
      role: "MEDIA_MAKER",
      phoneNumber: "3234567890",
      email: "project@gmail.com",
      hashedPassword: await passwordService.hashPassword("password123"),
      sessions: {
        create: {
          sessionId: "project-session-id",
          expiresAt: new Date(Date.now() + 5_000_000_000),
        },
      },
    },
  });

  const projectSubmission = await prisma.projectSubmission.create({
    data: {
      projectId: "projectSubmission",
      projectOwnerId: projectOwner.userId,
      projectTitle: "title",
      description: "a project hoping to showcase the effects of climate change",
      deadline: new Date(Date.now() + 2_000_000_000),
      projectType: ProjectType.MOTION_PICTURE,
      projectManagerId: "matcher",
    },
  });

  await prisma.songRequest.create({
    data: {
      songRequestTitle: "Save the Earth",
      songRequestId: "songRequestOneSubmission",
      description: "wildfires in CA",
      feelingsConveyed: "rnb, soul",
      projectId: projectSubmission.projectId,
      similarSongs: "Hey Jude",
    },
  });

  await prisma.user.create({
    data: {
      userId: "sanjana",
      firstName: "ABCDEF",
      lastName: "ABCDEF",
      role: "ADMIN",
      phoneNumber: "4234567890",
      email: "sanjana@gmail.com",
      hashedPassword: await passwordService.hashPassword("password123"),
      sessions: {
        create: {
          sessionId: "sanjana-session-id",
          expiresAt: new Date(Date.now() + 5_000_000_000),
        },
      },
    },
  });
}

async function deleteData() {
  // Delete Comments (created in tests)
  await prisma.comments.deleteMany({
    where: {
      songRequestId: "songRequestOneSubmission",
    },
  });

  // Delete Match
  await prisma.match.deleteMany({
    where: { matchId: "match" },
  });

  // Delete Match for suggestMatch tests
  await prisma.match.deleteMany({
    where: {
      songRequestId: "songRequestOneSubmission",
    },
  });

  // Delete SongRequest
  await prisma.songRequest.deleteMany({
    where: { songRequestId: "songRequestOneSubmission" },
  });

  // Delete ProjectSubmission
  await prisma.projectSubmission.deleteMany({
    where: { projectId: "projectSubmission" },
  });

  // Delete MusicSubmission
  await prisma.musicSubmission.deleteMany({
    where: { musicId: "musicSubmission" },
  });

  // Delete Users
  await prisma.user.deleteMany({
    where: {
      userId: {
        in: ["matcher", "musician", "projectOwner", "sanjana"],
      },
    },
  });
}

describe("match procedure", () => {
  const cookies = new MockNextCookies();
  const cache = new MockNextCache();

  beforeAll(async () => {
    await cache.apply();
  });

  beforeEach(async () => {
    await createData();
  });

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(cookies),
    prisma: prisma,
  });

  afterEach(async () => {
    await deleteData();
    cookies.clear();
    cache.clear();
  });

  it("should allow a moderator to create a NEW match (as projectManager)", async () => {
    cookies.set("sessionId", "moderator-session-id");

    const response = await $api.createMatch({
      songRequestId: "songRequestOneSubmission",
      musicId: "musicSubmission",
    });

    expect(response.message).toEqual("Match successfully created.");

    const match = await prisma.match.findFirst({
      where: {
        songRequestId: "songRequestOneSubmission",
        musicId: "musicSubmission",
        matcherUserId: "matcher",
      },
    });

    expect(match).toBeDefined();
    expect(match?.matchState).toBe(MatchState.NEW);
    expect(match?.songRequestId).toBe("songRequestOneSubmission");
    expect(match?.musicId).toBe("musicSubmission");
    expect(match?.matcherUserId).toBe("matcher");
  });

  it("should allow an admin to create a WAITING_FOR_MANAGER_APPROVAL match (not as projectManager)", async () => {
    cookies.set("sessionId", "sanjana-session-id");

    const response = await $api.createMatch({
      songRequestId: "songRequestOneSubmission",
      musicId: "musicSubmission",
    });

    expect(response.message).toEqual("Match successfully created.");

    const match = await prisma.match.findFirst({
      where: {
        songRequestId: "songRequestOneSubmission",
        musicId: "musicSubmission",
        matcherUserId: "sanjana",
      },
    });

    expect(match).toBeDefined();
    expect(match?.matchState).toBe(MatchState.WAITING_FOR_MANAGER_APPROVAL);
    expect(match?.songRequestId).toBe("songRequestOneSubmission");
    expect(match?.musicId).toBe("musicSubmission");
    expect(match?.matcherUserId).toBe("sanjana");
  });

  it("should throw error when given invalid songRequestId", () => {
    cookies.set("sessionId", "sanjana-session-id");

    expect(
      $api.createMatch({
        songRequestId: "songRequestOneSubmission",
        musicId: "invalid",
      }),
    ).rejects.toThrow("Foreign key constraint violated");
  });

  it("should throw error when given invalid musicId", () => {
    cookies.set("sessionId", "sanjana-session-id");

    expect(
      $api.createMatch({
        songRequestId: "invalid",
        musicId: "musicSubmission",
      }),
    ).rejects.toThrow("Foreign key constraint violated");
  });

  it("should not allow a musician to create a match", () => {
    cookies.set("sessionId", "musician-session-id");

    expect(
      $api.createMatch({
        songRequestId: "songRequestOneSubmission",
        musicId: "musicSubmission",
      }),
    ).rejects.toThrow("permission to modify");
  });

  it("should not allow a media maker to create a match", () => {
    cookies.set("sessionId", "project-session-id");

    expect(
      $api.createMatch({
        songRequestId: "songRequestOneSubmission",
        musicId: "musicSubmission",
      }),
    ).rejects.toThrow("permission to modify");
  });
});
