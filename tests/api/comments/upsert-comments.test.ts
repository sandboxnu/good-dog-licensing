import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "bun:test";

import { passwordService } from "@good-dog/auth/password";
import { prisma } from "@good-dog/db";
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
      genre: "hip hop",
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
    },
  });

  await prisma.songRequest.create({
    data: {
      oneLineSummary: "Test One Line Summary",
      songRequestId: "songRequestOneSubmission",
      description: "wildfires in CA",
      musicType: "rnb, soul",
      projectId: projectSubmission.projectId,
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

async function createMoreData() {
  await prisma.match.create({
    data: {
      matchId: "match",
      songRequestId: "songRequestOneSubmission",
      musicId: "musicSubmission",
      matcherUserId: "matcher",
      matchState: "NEW",
    },
  });

  await prisma.comments.create({
    data: {
      commentId: "testComment",
      userId: "matcher",
      commentText: "hello",
      songRequestId: "songRequestOneSubmission",
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

describe("upsertCommentsProcedure", () => {
  const cookies = new MockNextCookies();
  const cache = new MockNextCache();

  beforeAll(async () => {
    await cache.apply();
  });

  beforeEach(async () => {
    await createData();
    await createMoreData();
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

  it("should allow admins to create comments on matches", async () => {
    cookies.set("sessionId", "sanjana-session-id");

    const response = await $api.comment({
      songRequestId: "songRequestOneSubmission",
      comment: {
        commentText:
          "why would you pair an upbeat song on such a heavy topic? it doesn't make sense.",
        userId: "sanjana",
      },
    });

    expect(response.message).toEqual("Comments successfully updated.");

    const createdComment = await prisma.comments.findFirst({
      where: {
        songRequestId: "songRequestOneSubmission",
        userId: "sanjana",
      },
    });

    expect(createdComment).toBeDefined();
    expect(createdComment?.commentText).toBe(
      "why would you pair an upbeat song on such a heavy topic? it doesn't make sense.",
    );
  });

  it("should allow moderators to comment on matches", async () => {
    cookies.set("sessionId", "moderator-session-id");

    const response = await $api.comment({
      songRequestId: "songRequestOneSubmission",
      comment: {
        commentText: "hello",
        userId: "matcher",
      },
    });

    expect(response.message).toEqual("Comments successfully updated.");

    const createdComment = await prisma.comments.findFirst({
      where: {
        songRequestId: "songRequestOneSubmission",
        userId: "matcher",
      },
    });

    expect(createdComment).toBeDefined();
    expect(createdComment?.commentText).toBe("hello");
  });

  it("should prevent normal users from commenting on suggested matches", () => {
    cookies.set("sessionId", "musician-session-id");

    expect(
      $api.comment({
        songRequestId: "songRequestOneSubmission",
        comment: {
          commentText: "hello",
          userId: "musician",
        },
      }),
    ).rejects.toThrow("permission to modify");
  });

  it("should allow users who made a comment to update it", async () => {
    cookies.set("sessionId", "sanjana-session-id");

    const response = await $api.comment({
      songRequestId: "songRequestOneSubmission",
      comment: {
        commentText:
          "why would you pair an upbeat song on such a heavy topic? it doesn't make sense.",
        userId: "sanjana",
      },
    });

    expect(response.message).toEqual("Comments successfully updated.");

    const createdComment = await prisma.comments.findFirst({
      where: {
        songRequestId: "songRequestOneSubmission",
        userId: "sanjana",
      },
    });

    expect(createdComment).toBeDefined();
    expect(createdComment?.commentText).toBe(
      "why would you pair an upbeat song on such a heavy topic? it doesn't make sense.",
    );

    const updatedResponse = await $api.comment({
      commentId: createdComment?.commentId,
      songRequestId: "songRequestOneSubmission",
      comment: {
        commentText: "hi hi",
        userId: "sanjana",
      },
    });

    expect(updatedResponse.message).toEqual("Comments successfully updated.");

    const updatedComment = await prisma.comments.findFirst({
      where: {
        songRequestId: "songRequestOneSubmission",
        userId: "sanjana",
      },
    });

    expect(updatedComment).toBeDefined();
    expect(updatedComment?.commentText).toEqual("hi hi");
  });

  it("should prevent other users from modifying comments that are not theirs", () => {
    cookies.set("sessionId", "sanjana-session-id");

    expect(
      $api.comment({
        commentId: "testComment",
        comment: {
          userId: "sanjana",
          commentText: "hi hi",
        },
        songRequestId: "songRequestOneSubmission",
      }),
    ).rejects.toThrow();
  });
});
