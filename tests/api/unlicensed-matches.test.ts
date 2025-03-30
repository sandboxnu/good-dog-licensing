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

  await prisma.musicianGroup.create({
    data: {
      groupId: "musicianGroup",
      organizerId: musician.userId,
      name: "Bad Dogs",
    },
  });

  await prisma.unlicensedMusicSubmission.create({
    data: {
      musicId: "musicSubmission",
      songName: "3005",
      songLink:
        "https://open.spotify.com/track/2X6b7zLdIxCejd6GqVcQ9M?si=b36f9306fab04109",
      genre: "hip hop",
      artist: "childish gambino",
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
      projectTitle: "project",
      projectId: "projectSubmission",
      projectOwnerId: projectOwner.userId,
      description: "a project hoping to showcase the effects of climate change",
      deadline: new Date(Date.now() + 2_000_000_000),
    },
  });

  await prisma.sceneSubmission.create({
    data: {
      sceneTitle: "title",
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
  await prisma.unlicensedSuggestedMatch.create({
    data: {
      unlicensedSuggestedMatchId: "match",
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
      unlicensedSuggestedMatchId: "match",
    },
  });
}

async function deleteData() {
  // Delete MatchComments (created in tests)
  await prisma.matchComments.deleteMany({
    where: {
      unlicensedSuggestedMatchId: "match",
    },
  });

  // Delete SuggestedMatch
  await prisma.unlicensedSuggestedMatch.deleteMany({
    where: { unlicensedSuggestedMatchId: "match" },
  });

  // Delete SuggestedMatch for suggestMatch tests
  await prisma.unlicensedSuggestedMatch.deleteMany({
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
  await prisma.unlicensedMusicSubmission.deleteMany({
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
      unlicensed: true,
      matchComment: {
        commentText:
          "why would you pair an upbeat song on such a heavy topic? it doesn't make sense.",
        userId: "sanjana",
      },
    });

    expect(response.message).toEqual("Comments successfully updated.");

    const createdComment = await prisma.matchComments.findFirst({
      where: {
        unlicensedSuggestedMatchId: "match",
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
      unlicensed: true,
      matchComment: {
        commentText: "hello",
        userId: "matcher",
      },
    });

    expect(response.message).toEqual("Comments successfully updated.");

    const createdComment = await prisma.matchComments.findFirst({
      where: {
        unlicensedSuggestedMatchId: "match",
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
        unlicensed: true,
        matchComment: {
          commentText: "hello",
          userId: "musician",
        },
      }),
    ).rejects.toThrow("FORBIDDEN");
  });

  it("should allow users who made a comment to update it", async () => {
    cookies.set("sessionId", "sanjana-session-id");

    const response = await $api.comment({
      matchId: "match",
      unlicensed: true,
      matchComment: {
        commentText:
          "why would you pair an upbeat song on such a heavy topic? it doesn't make sense.",
        userId: "sanjana",
      },
    });

    expect(response.message).toEqual("Comments successfully updated.");

    const createdComment = await prisma.matchComments.findFirst({
      where: {
        unlicensedSuggestedMatchId: "match",
        userId: "sanjana",
      },
    });

    expect(createdComment).toBeDefined();
    expect(createdComment?.commentText).toBe(
      "why would you pair an upbeat song on such a heavy topic? it doesn't make sense.",
    );

    const updatedResponse = await $api.comment({
      commentId: createdComment?.commentId,
      unlicensed: true,
      matchId: "match",
      matchComment: {
        commentText: "hi hi",
        userId: "sanjana",
      },
    });

    expect(updatedResponse.message).toEqual("Comments successfully updated.");

    const updatedComment = await prisma.matchComments.findFirst({
      where: {
        unlicensedSuggestedMatchId: "match",
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
        unlicensed: true,
        matchComment: {
          userId: "sanjana",
          commentText: "hi hi",
        },
        matchId: "match",
      }),
    ).rejects.toThrow();
  });
});

describe("unlicensed suggested match procedure", () => {
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

    const response = await $api.unlicensedSuggestMatch({
      projectId: "projectSubmission",
      sceneId: "sceneOneSubmission",
      musicId: "musicSubmission",
      description: "This is a great match.",
    });

    expect(response.message).toEqual("Match successfully suggested.");

    const suggestedMatch = await prisma.unlicensedSuggestedMatch.findFirst({
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

    const response = await $api.unlicensedSuggestMatch({
      projectId: "projectSubmission",
      sceneId: "sceneOneSubmission",
      musicId: "musicSubmission",
      description: "wow, this is a great match.",
    });

    expect(response.message).toEqual("Match successfully suggested.");

    const suggestedMatch = await prisma.unlicensedSuggestedMatch.findFirst({
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
      $api.unlicensedSuggestMatch({
        projectId: "projectSubmission",
        sceneId: "sceneOneSubmission",
        musicId: "musicSubmission",
        description: "This is a great match.",
      }),
    ).rejects.toThrow("FORBIDDEN");
  });

  it("should allow a user to update the description for their own suggested match", async () => {
    cookies.set("sessionId", "moderator-session-id");

    const originalResponse = await $api.unlicensedSuggestMatch({
      projectId: "projectSubmission",
      sceneId: "sceneOneSubmission",
      musicId: "musicSubmission",
      description: "This is a great match.",
    });

    expect(originalResponse.message).toEqual("Match successfully suggested.");

    const match = await prisma.unlicensedSuggestedMatch.findFirst({
      where: {
        sceneId: "sceneOneSubmission",
        projectId: "projectSubmission",
      },
    });

    const updatedResponse = await $api.unlicensedSuggestMatch({
      matchId: match?.unlicensedSuggestedMatchId,
      description: "This is an even better match.",
    });

    expect(updatedResponse.message).toEqual("Match successfully updated.");

    const updatedMatch = await prisma.unlicensedSuggestedMatch.findFirst({
      where: {
        unlicensedSuggestedMatchId: match?.unlicensedSuggestedMatchId,
      },
    });

    expect(updatedMatch).toBeDefined();
    expect(updatedMatch?.description).toBe("This is an even better match.");
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
    ).rejects.toThrow("FORBIDDEN");
  });
});
