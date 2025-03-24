import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "bun:test";

import { passwordService } from "@good-dog/auth/password";
import { MatchState, prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCache } from "../mocks/MockNextCache";
import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

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

  const musicianGroup = await prisma.musicianGroup.create({
    data: {
      groupId: "musicianGroup",
      organizerId: musician.userId,
      name: "Bad Dogs",
    },
  });

  await prisma.musicSubmission.create({
    data: {
      musicId: "musicSubmission",
      songName: "3005",
      songLink:
        "https://open.spotify.com/track/2X6b7zLdIxCejd6GqVcQ9M?si=b36f9306fab04109",
      genre: "hip hop",
      groupId: musicianGroup.groupId,
      artistId: musician.userId,
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
      description: "a project hoping to showcase the effects of climate change",
      deadline: new Date(Date.now() + 2_000_000_000),
    },
  });

  await prisma.sceneSubmission.create({
    data: {
      sceneId: "sceneOneSubmission",
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
  await prisma.suggestedMatch.create({
    data: {
      matchId: "match",
      projectId: "projectSubmission",
      sceneId: "sceneOneSubmission",
      musicId: "musicSubmission",
      description: "the joyous vibe of this song would go well with the flames",
      matcherUserId: "matcher",
      matchState: "PENDING",
    },
  });

  await prisma.matchComments.create({
    data: {
      commentId: "testComment",
      userId: "matcher",
      commentText: "hello",
      matchId: "match",
    },
  });
}

async function deleteData() {
  // Delete MatchComments (created in tests)
  await prisma.matchComments.deleteMany({
    where: {
      matchId: "match",
    },
  });

  // Delete SuggestedMatch
  await prisma.suggestedMatch.deleteMany({
    where: { matchId: "match" },
  });

  // Delete SuggestedMatch for suggestMatch tests
  await prisma.suggestedMatch.deleteMany({
    where: {
      sceneId: "sceneOneSubmission",
    },
  });

  // Delete SceneSubmission
  await prisma.sceneSubmission.deleteMany({
    where: { sceneId: "sceneOneSubmission" },
  });

  // Delete ProjectSubmission
  await prisma.projectSubmission.deleteMany({
    where: { projectId: "projectSubmission" },
  });

  // Delete MusicSubmission
  await prisma.musicSubmission.deleteMany({
    where: { musicId: "musicSubmission" },
  });

  // Delete MusicianGroup
  await prisma.musicianGroup.deleteMany({
    where: { groupId: "musicianGroup" },
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

describe("createUpdateMatchCommentsProcedure", () => {
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

  it("should allow admins to create comments on suggested matches", async () => {
    cookies.set("sessionId", "sanjana-session-id");

    const response = await $api.comment({
      matchId: "match",
      matchComment: {
        commentText:
          "why would you pair an upbeat song on such a heavy topic? it doesn't make sense.",
        userId: "sanjana",
      },
    });

    expect(response.message).toEqual("Comments successfully updated.");

    const createdComment = await prisma.matchComments.findFirst({
      where: {
        matchId: "match",
        userId: "sanjana",
      },
    });

    expect(createdComment).toBeDefined();
    expect(createdComment?.commentText).toBe(
      "why would you pair an upbeat song on such a heavy topic? it doesn't make sense.",
    );
  });

  it("should allow moderators to comment on suggested matches", async () => {
    cookies.set("sessionId", "moderator-session-id");

    const response = await $api.comment({
      matchId: "match",
      matchComment: {
        commentText: "hello",
        userId: "matcher",
      },
    });

    expect(response.message).toEqual("Comments successfully updated.");

    const createdComment = await prisma.matchComments.findFirst({
      where: {
        matchId: "match",
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
        matchId: "match",
        matchComment: {
          commentText: "hello",
          userId: "musician",
        },
      }),
    ).rejects.toThrow("permission to modify");
  });

  it("should allow users who made a comment to update it", async () => {
    cookies.set("sessionId", "sanjana-session-id");

    const response = await $api.comment({
      matchId: "match",
      matchComment: {
        commentText:
          "why would you pair an upbeat song on such a heavy topic? it doesn't make sense.",
        userId: "sanjana",
      },
    });

    expect(response.message).toEqual("Comments successfully updated.");

    const createdComment = await prisma.matchComments.findFirst({
      where: {
        matchId: "match",
        userId: "sanjana",
      },
    });

    expect(createdComment).toBeDefined();
    expect(createdComment?.commentText).toBe(
      "why would you pair an upbeat song on such a heavy topic? it doesn't make sense.",
    );

    const updatedResponse = await $api.comment({
      commentId: createdComment?.commentId,
      matchId: "match",
      matchComment: {
        commentText: "hi hi",
        userId: "sanjana",
      },
    });

    expect(updatedResponse.message).toEqual("Comments successfully updated.");

    const updatedComment = await prisma.matchComments.findFirst({
      where: {
        matchId: "match",
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
        matchComment: {
          userId: "sanjana",
          commentText: "hi hi",
        },
        matchId: "match",
      }),
    ).rejects.toThrow();
  });
});

describe("suggested match procedure", () => {
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

  it("should allow a moderator to suggest a match", async () => {
    cookies.set("sessionId", "moderator-session-id");

    const response = await $api.suggestMatch({
      projectId: "projectSubmission",
      sceneId: "sceneOneSubmission",
      musicId: "musicSubmission",
      description: "This is a great match.",
    });

    expect(response.message).toEqual("Match successfully suggested.");

    const suggestedMatch = await prisma.suggestedMatch.findFirst({
      where: {
        projectId: "projectSubmission",
        sceneId: "sceneOneSubmission",
        musicId: "musicSubmission",
        matcherUserId: "matcher",
      },
    });

    expect(suggestedMatch).toBeDefined();
  });

  it("should allow an admin to suggest a match", async () => {
    cookies.set("sessionId", "sanjana-session-id");

    const response = await $api.suggestMatch({
      projectId: "projectSubmission",
      sceneId: "sceneOneSubmission",
      musicId: "musicSubmission",
      description: "wow, this is a great match.",
    });

    expect(response.message).toEqual("Match successfully suggested.");

    const suggestedMatch = await prisma.suggestedMatch.findFirst({
      where: {
        projectId: "projectSubmission",
        sceneId: "sceneOneSubmission",
        musicId: "musicSubmission",
        matcherUserId: "sanjana",
      },
    });

    expect(suggestedMatch).toBeDefined();
  });

  it("should not allow a normal user to suggest a match", () => {
    cookies.set("sessionId", "musician-session-id");

    expect(
      $api.suggestMatch({
        projectId: "projectSubmission",
        sceneId: "sceneOneSubmission",
        musicId: "musicSubmission",
        description: "This is a great match.",
      }),
    ).rejects.toThrow("permission to modify");
  });

  it("should allow a user to update the description for their own suggested match", async () => {
    cookies.set("sessionId", "moderator-session-id");

    const originalResponse = await $api.suggestMatch({
      projectId: "projectSubmission",
      sceneId: "sceneOneSubmission",
      musicId: "musicSubmission",
      description: "This is a great match.",
    });

    expect(originalResponse.message).toEqual("Match successfully suggested.");

    const match = await prisma.suggestedMatch.findFirst({
      where: {
        sceneId: "sceneOneSubmission",
        projectId: "projectSubmission",
      },
    });

    const updatedResponse = await $api.suggestMatch({
      matchId: match?.matchId,
      description: "This is an even better match.",
    });

    expect(updatedResponse.message).toEqual("Match successfully updated.");

    const updatedMatch = await prisma.suggestedMatch.findFirst({
      where: {
        matchId: match?.matchId,
      },
    });

    expect(updatedMatch).toBeDefined();
    expect(updatedMatch?.description).toBe("This is an even better match.");
  });
});

describe("reviewSuggestedMatchProcedure", () => {
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

  it("should allow an admin to approve a match", async () => {
    cookies.set("sessionId", "sanjana-session-id");

    await $api.reviewMatch({
      matchId: "match",
      matchState: MatchState.APPROVED,
    });

    const updatedMatch = await prisma.suggestedMatch.findFirst({
      where: {
        matchId: "match",
      },
    });

    expect(updatedMatch).toBeDefined();
    expect(updatedMatch?.matchState).toBe(MatchState.APPROVED);
    expect(updatedMatch?.reviewerId).toBe("sanjana");
  });

  it("should allow an admin to reject a match", async () => {
    cookies.set("sessionId", "sanjana-session-id");

    await $api.reviewMatch({
      matchId: "match",
      matchState: MatchState.REJECTED,
    });

    const updatedMatch = await prisma.suggestedMatch.findFirst({
      where: {
        matchId: "match",
      },
    });

    expect(updatedMatch).toBeDefined();
    expect(updatedMatch?.matchState).toBe(MatchState.REJECTED);
    expect(updatedMatch?.reviewerId).toBe("sanjana");
  });

  it("should prevent a moderator from reviewing a match", () => {
    cookies.set("sessionId", "moderator-session-id");

    expect(
      $api.reviewMatch({
        matchId: "match",
        matchState: MatchState.APPROVED,
      }),
    ).rejects.toThrow("permission to modify");
  });

  it("should prevent a regular user from reviewing a match", () => {
    cookies.set("sessionId", "musician-session-id");

    expect(
      $api.reviewMatch({
        matchId: "match",
        matchState: MatchState.APPROVED,
      }),
    ).rejects.toThrow("permission to modify");
  });
});

describe("getMatchesProcedure", () => {
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

  it("should return all matches for an admin", async () => {
    cookies.set("sessionId", "sanjana-session-id");

    const { matches } = await $api.match({
      matchState: MatchState.PENDING,
    });

    expect(matches).not.toBeNull();
    matches.forEach((m) => {
      expect(m.matchState).toBe(MatchState.PENDING);
    });
  });

  it("should return all matches for a moderator", async () => {
    cookies.set("sessionId", "moderator-session-id");

    const { matches } = await $api.match({
      matchState: MatchState.PENDING,
    });

    expect(matches).not.toBeNull();
    matches.forEach((m) => {
      expect(m.matchState).toBe(MatchState.PENDING);
    });
  });

  it("should not allow a normal user to get all matches", () => {
    cookies.set("sessionId", "musician-session-id");

    expect(
      $api.match({
        matchState: MatchState.PENDING,
      }),
    ).rejects.toThrow("permission to read");
  });
});
