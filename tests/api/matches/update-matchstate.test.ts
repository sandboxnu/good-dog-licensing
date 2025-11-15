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
  // Create moderator
  await prisma.user.create({
    data: {
      userId: "moderator",
      firstName: "Jane",
      lastName: "Doe",
      role: "MODERATOR",
      phoneNumber: "1234556789",
      email: "moderator@gmail.com",
      hashedPassword: await passwordService.hashPassword("password123"),
      sessions: {
        create: {
          sessionId: "moderator-session-id",
          expiresAt: new Date(Date.now() + 5_000_000_000),
        },
      },
    },
  });

  // Create musician
  const musician = await prisma.user.create({
    data: {
      userId: "musician",
      firstName: "John",
      lastName: "Musician",
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

  // Create another musician
  await prisma.user.create({
    data: {
      userId: "otherMusician",
      firstName: "Other",
      lastName: "Musician",
      role: "MUSICIAN",
      phoneNumber: "2234567891",
      email: "othermusician@gmail.com",
      hashedPassword: await passwordService.hashPassword("password123"),
      sessions: {
        create: {
          sessionId: "other-musician-session-id",
          expiresAt: new Date(Date.now() + 5_000_000_000),
        },
      },
    },
  });

  // Create music submission
  await prisma.musicSubmission.create({
    data: {
      musicId: "musicSubmission",
      songName: "Test Song",
      songLink: "https://open.spotify.com/track/test",
      genres: [Genre.HIP_HOP],
      submitterId: musician.userId,
      performerName: "Test Artist",
    },
  });

  // Create project owner (media maker)
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

  // Create another media maker
  await prisma.user.create({
    data: {
      userId: "otherMediaMaker",
      firstName: "Other",
      lastName: "MediaMaker",
      role: "MEDIA_MAKER",
      phoneNumber: "3234567891",
      email: "othermediamaker@gmail.com",
      hashedPassword: await passwordService.hashPassword("password123"),
      sessions: {
        create: {
          sessionId: "other-mediamaker-session-id",
          expiresAt: new Date(Date.now() + 5_000_000_000),
        },
      },
    },
  });

  // Create project submission
  const projectSubmission = await prisma.projectSubmission.create({
    data: {
      projectId: "projectSubmission",
      projectOwnerId: projectOwner.userId,
      projectTitle: "Test Project",
      description: "A test project",
      deadline: new Date(Date.now() + 2_000_000_000),
      projectType: ProjectType.MOTION_PICTURE,
    },
  });

  // Create song request
  await prisma.songRequest.create({
    data: {
      songRequestId: "songRequest",
      description: "Test description",
      feelingsConveyed: "rnb, soul",
      projectId: projectSubmission.projectId,
      similarSongs: "Hey Jude",
    },
  });

  // Create match
  await prisma.match.create({
    data: {
      matchId: "match",
      songRequestId: "songRequest",
      musicId: "musicSubmission",
      matcherUserId: "moderator",
      matchState: MatchState.NEW,
    },
  });
}

async function deleteData() {
  // Delete Match
  await prisma.match.deleteMany({
    where: { matchId: "match" },
  });

  // Delete SongRequest
  await prisma.songRequest.deleteMany({
    where: { songRequestId: "songRequest" },
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
        in: [
          "moderator",
          "musician",
          "otherMusician",
          "projectOwner",
          "otherMediaMaker",
        ],
      },
    },
  });
}

describe("updateMatchState procedure", () => {
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

  // SUCCESS CASES - MEDIA MAKER

  it("should allow project owner to update match to SONG_REQUESTED", async () => {
    cookies.set("sessionId", "project-session-id");

    const response = await $api.updateMatchState({
      matchId: "match",
      state: MatchState.SONG_REQUESTED,
    });

    expect(response.message).toEqual("Match state updated successfully");
    expect(response.match.matchState).toBe(MatchState.SONG_REQUESTED);

    const match = await prisma.match.findUnique({
      where: { matchId: "match" },
    });

    expect(match?.matchState).toBe(MatchState.SONG_REQUESTED);
  });

  it("should allow project owner to update match to REJECTED_BY_MEDIA_MAKER", async () => {
    cookies.set("sessionId", "project-session-id");

    const response = await $api.updateMatchState({
      matchId: "match",
      state: MatchState.REJECTED_BY_MEDIA_MAKER,
    });

    expect(response.message).toEqual("Match state updated successfully");
    expect(response.match.matchState).toBe(MatchState.REJECTED_BY_MEDIA_MAKER);

    const match = await prisma.match.findUnique({
      where: { matchId: "match" },
    });

    expect(match?.matchState).toBe(MatchState.REJECTED_BY_MEDIA_MAKER);
  });

  // SUCCESS CASES - MUSICIAN

  it("should allow musician to update match to APPROVED_BY_MUSICIAN", async () => {
    cookies.set("sessionId", "musician-session-id");

    const response = await $api.updateMatchState({
      matchId: "match",
      state: MatchState.APPROVED_BY_MUSICIAN,
    });

    expect(response.message).toEqual("Match state updated successfully");
    expect(response.match.matchState).toBe(MatchState.APPROVED_BY_MUSICIAN);

    const match = await prisma.match.findUnique({
      where: { matchId: "match" },
    });

    expect(match?.matchState).toBe(MatchState.APPROVED_BY_MUSICIAN);
  });

  it("should allow musician to update match to REJECTED_BY_MUSICIAN", async () => {
    cookies.set("sessionId", "musician-session-id");

    const response = await $api.updateMatchState({
      matchId: "match",
      state: MatchState.REJECTED_BY_MUSICIAN,
    });

    expect(response.message).toEqual("Match state updated successfully");
    expect(response.match.matchState).toBe(MatchState.REJECTED_BY_MUSICIAN);

    const match = await prisma.match.findUnique({
      where: { matchId: "match" },
    });

    expect(match?.matchState).toBe(MatchState.REJECTED_BY_MUSICIAN);
  });

  // FAILURE CASES - CANNOT GO BACK TO NEW

  it("should not allow updating match back to NEW state", () => {
    cookies.set("sessionId", "project-session-id");

    expect(
      $api.updateMatchState({
        matchId: "match",
        state: MatchState.NEW,
      }),
    ).rejects.toThrow("Cannot update a match back to NEW state");
  });

  // FAILURE CASES - ROLE PERMISSIONS

  it("should not allow musician to update match to SONG_REQUESTED", () => {
    cookies.set("sessionId", "musician-session-id");

    expect(
      $api.updateMatchState({
        matchId: "match",
        state: MatchState.SONG_REQUESTED,
      }),
    ).rejects.toThrow(
      "This role does not have permission to perform the requested match state change",
    );
  });

  it("should not allow musician to update match to REJECTED_BY_MEDIA_MAKER", () => {
    cookies.set("sessionId", "musician-session-id");

    expect(
      $api.updateMatchState({
        matchId: "match",
        state: MatchState.REJECTED_BY_MEDIA_MAKER,
      }),
    ).rejects.toThrow(
      "This role does not have permission to perform the requested match state change",
    );
  });

  it("should not allow media maker to update match to APPROVED_BY_MUSICIAN", () => {
    cookies.set("sessionId", "project-session-id");

    expect(
      $api.updateMatchState({
        matchId: "match",
        state: MatchState.APPROVED_BY_MUSICIAN,
      }),
    ).rejects.toThrow(
      "This role does not have permission to perform the requested match state change",
    );
  });

  it("should not allow media maker to update match to REJECTED_BY_MUSICIAN", () => {
    cookies.set("sessionId", "project-session-id");

    expect(
      $api.updateMatchState({
        matchId: "match",
        state: MatchState.REJECTED_BY_MUSICIAN,
      }),
    ).rejects.toThrow(
      "This role does not have permission to perform the requested match state change",
    );
  });

  it("should not allow moderator to update match to SONG_REQUESTED", () => {
    cookies.set("sessionId", "moderator-session-id");

    expect(
      $api.updateMatchState({
        matchId: "match",
        state: MatchState.SONG_REQUESTED,
      }),
    ).rejects.toThrow(
      "This role does not have permission to perform the requested match state change",
    );
  });

  it("should not allow moderator to update match to APPROVED_BY_MUSICIAN", () => {
    cookies.set("sessionId", "moderator-session-id");

    expect(
      $api.updateMatchState({
        matchId: "match",
        state: MatchState.APPROVED_BY_MUSICIAN,
      }),
    ).rejects.toThrow(
      "This role does not have permission to perform the requested match state change",
    );
  });

  // FAILURE CASES - WRONG PROJECT/MUSIC OWNERSHIP

  it("should not allow media maker to update match for someone else's project", () => {
    cookies.set("sessionId", "other-mediamaker-session-id");

    expect(
      $api.updateMatchState({
        matchId: "match",
        state: MatchState.SONG_REQUESTED,
      }),
    ).rejects.toThrow(
      "Media makers can only update the state of matches that involve their projects",
    );
  });

  it("should not allow musician to update match for someone else's music", () => {
    cookies.set("sessionId", "other-musician-session-id");

    expect(
      $api.updateMatchState({
        matchId: "match",
        state: MatchState.APPROVED_BY_MUSICIAN,
      }),
    ).rejects.toThrow(
      "Musicians can only update the state of matches that involve their projects",
    );
  });

  // FAILURE CASES - NON-EXISTENT MATCH

  it("should throw error when given invalid matchId", () => {
    cookies.set("sessionId", "project-session-id");

    expect(
      $api.updateMatchState({
        matchId: "nonexistent-match",
        state: MatchState.SONG_REQUESTED,
      }),
    ).rejects.toThrow("Match id does not exist");
  });
});
