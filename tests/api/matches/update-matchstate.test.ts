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
  // Create admin
  await prisma.user.create({
    data: {
      userId: "admin",
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      phoneNumber: "1234556788",
      email: "admin@gmail.com",
      hashedPassword: await passwordService.hashPassword("password123"),
      sessions: {
        create: {
          sessionId: "admin-session-id",
          expiresAt: new Date(Date.now() + 5_000_000_000),
        },
      },
    },
  });

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

  // Create another music submission
  await prisma.musicSubmission.create({
    data: {
      musicId: "musicSubmission2",
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
      projectManagerId: "moderator",
      projectTitle: "Test Project",
      description: "A test project",
      deadline: new Date(Date.now() + 2_000_000_000),
      projectType: ProjectType.MOTION_PICTURE,
    },
  });

  // Create song request
  await prisma.songRequest.create({
    data: {
      songRequestTitle: "Test Song Request",
      songRequestId: "songRequest",
      description: "Test description",
      feelingsConveyed: "rnb, soul",
      projectId: projectSubmission.projectId,
      similarSongs: "Hey Jude",
    },
  });

  // Create another song request
  await prisma.songRequest.create({
    data: {
      songRequestTitle: "Test Song Request",
      songRequestId: "songRequest2",
      description: "Test description",
      feelingsConveyed: "rnb, soul",
      projectId: projectSubmission.projectId,
      similarSongs: "Hey Jude",
    },
  });

  // Create NEW match
  await prisma.match.create({
    data: {
      matchId: "match",
      songRequestId: "songRequest",
      musicId: "musicSubmission",
      matcherUserId: "moderator",
      matchState: MatchState.NEW,
    },
  });

  // Create SONG_REQUEST match
  await prisma.match.create({
    data: {
      matchId: "match-song-requested",
      songRequestId: "songRequest",
      musicId: "musicSubmission2",
      matcherUserId: "moderator",
      matchState: MatchState.SONG_REQUESTED,
    },
  });

  // Create WAITING_FOR_MANAGER_APPROVAL match
  await prisma.match.create({
    data: {
      matchId: "match-waiting",
      songRequestId: "songRequest2",
      musicId: "musicSubmission",
      matcherUserId: "moderator",
      matchState: MatchState.WAITING_FOR_MANAGER_APPROVAL,
    },
  });
}

async function deleteData() {
  // Delete Match
  await prisma.match.deleteMany({
    where: {
      matchId: {
        in: ["match", "match-song-requested", "match-waiting"],
      },
    },
  });

  // Delete SongRequest
  await prisma.songRequest.deleteMany({
    where: { songRequestId: "songRequest" },
  });

  await prisma.songRequest.deleteMany({
    where: { songRequestId: "songRequest2" },
  });

  // Delete ProjectSubmission
  await prisma.projectSubmission.deleteMany({
    where: { projectId: "projectSubmission" },
  });

  // Delete MusicSubmission
  await prisma.musicSubmission.deleteMany({
    where: { musicId: "musicSubmission" },
  });

  await prisma.musicSubmission.deleteMany({
    where: { musicId: "musicSubmission2" },
  });

  // Delete Users
  await prisma.user.deleteMany({
    where: {
      userId: {
        in: [
          "admin",
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

  it("should allow project owner to update NEW match to SONG_REQUESTED", async () => {
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

  it("should allow project owner to update NEW match to REJECTED_BY_MEDIA_MAKER", async () => {
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

  it("should allow musician to update SONG_REQUESTED match to APPROVED_BY_MUSICIAN", async () => {
    cookies.set("sessionId", "musician-session-id");

    const response = await $api.updateMatchState({
      matchId: "match-song-requested",
      state: MatchState.APPROVED_BY_MUSICIAN,
    });

    expect(response.message).toEqual("Match state updated successfully");
    expect(response.match.matchState).toBe(MatchState.APPROVED_BY_MUSICIAN);

    const match = await prisma.match.findUnique({
      where: { matchId: "match-song-requested" },
    });

    expect(match?.matchState).toBe(MatchState.APPROVED_BY_MUSICIAN);
  });

  it("should allow musician to update SONG_REQUESTED match to REJECTED_BY_MUSICIAN", async () => {
    cookies.set("sessionId", "musician-session-id");

    const response = await $api.updateMatchState({
      matchId: "match-song-requested",
      state: MatchState.REJECTED_BY_MUSICIAN,
    });

    expect(response.message).toEqual("Match state updated successfully");
    expect(response.match.matchState).toBe(MatchState.REJECTED_BY_MUSICIAN);

    const match = await prisma.match.findUnique({
      where: { matchId: "match-song-requested" },
    });

    expect(match?.matchState).toBe(MatchState.REJECTED_BY_MUSICIAN);
  });

  // SUCCESS CASES - ADMIN/MODERATOR

  it("should allow admin/moderator to update match from WAITING to NEW", async () => {
    cookies.set("sessionId", "moderator-session-id");

    const response = await $api.updateMatchState({
      matchId: "match-waiting",
      state: MatchState.NEW,
    });

    expect(response.message).toEqual("Match state updated successfully");
    expect(response.match.matchState).toBe(MatchState.NEW);

    const match = await prisma.match.findUnique({
      where: { matchId: "match-waiting" },
    });

    expect(match?.matchState).toBe(MatchState.NEW);
  });

  // FAILURE CASES - ROLE PERMISSIONS

  it("should not allow musician to update NEW match", () => {
    cookies.set("sessionId", "musician-session-id");

    expect(
      $api.updateMatchState({
        matchId: "match",
        state: MatchState.APPROVED_BY_MUSICIAN,
      }),
    ).rejects.toThrow(
      "This role does not have permission to perform the requested match state change",
    );
  });

  it("should not allow musician to update SONG_REQUESTED match to REJECTED_BY_MEDIA_MAKER", () => {
    cookies.set("sessionId", "musician-session-id");

    expect(
      $api.updateMatchState({
        matchId: "match-song-requested",
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

  it("should not allow media maker to update SONG_REQUESTED match", () => {
    cookies.set("sessionId", "project-session-id");

    expect(
      $api.updateMatchState({
        matchId: "match-song-requested",
        state: MatchState.SONG_REQUESTED,
      }),
    ).rejects.toThrow(
      "This role does not have permission to perform the requested match state change",
    );
  });

  it("should not allow moderator to update match to SONG_REQUESTED", () => {
    cookies.set("sessionId", "moderator-session-id");

    expect(
      $api.updateMatchState({
        matchId: "match-waiting",
        state: MatchState.SONG_REQUESTED,
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
        matchId: "match-song-requested",
        state: MatchState.APPROVED_BY_MUSICIAN,
      }),
    ).rejects.toThrow(
      "Musicians can only update the state of matches that involve their projects",
    );
  });

  // FAILURE CASES - WRONG PROJECT MANAGER
  it("should not allow admin/moderator to update match for a project they don't manage", () => {
    cookies.set("sessionId", "admin-session-id");

    expect(
      $api.updateMatchState({
        matchId: "match-waiting",
        state: MatchState.NEW,
      }),
    ).rejects.toThrow(
      "Admins and moderators can only update the state of matches that are managed by them",
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
