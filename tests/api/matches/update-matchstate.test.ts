import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "bun:test";

import { MatchState, prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCache } from "../../mocks/MockNextCache";
import { MockNextCookies } from "../../mocks/MockNextCookies";
import { createMockCookieService } from "../../mocks/util";
import { createData, createMoreData, deleteData } from "./match-data-functions";

describe("update match state procedure", () => {
  const cookies = new MockNextCookies();
  const cache = new MockNextCache();

  beforeAll(async () => {
    await cache.apply();
  });

  beforeEach(async () => {
    await createData();
    await createMoreData();
    prisma.match.create({
      data: {
        songRequestId: "songRequestOneSubmission",
        musicId: "musicSubmission",
        matcherUserId: "matcher",
        matchState: MatchState.NEW,
      },
    });
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

  it("should not allow musicians to move a record to NEW state", async () => {
    cookies.set("sessionId", "music-session-id");
    expect(
      $api.updateMatchState({
        matchId: "match",
        state: "NEW",
      }),
    ).rejects.toThrow("Cannot update a match back to NEW state");
  });

  it("should not allow admins to move a record to NEW state", async () => {
    cookies.set("sessionId", "admin-session-id");
    expect(
      $api.updateMatchState({
        matchId: "match",
        state: "NEW",
      }),
    ).rejects.toThrow("Cannot update a match back to NEW state");
  });

  it("should not allow media makers to move a record to NEW state", async () => {
    cookies.set("sessionId", "mediamaker-session-id");
    expect(
      $api.updateMatchState({
        matchId: "match",
        state: "NEW",
      }),
    ).rejects.toThrow("Cannot update a match back to NEW state");
  });

  it("should not allow moderators to move a record to NEW state", async () => {
    cookies.set("sessionId", "moderator-session-id");
    expect(
      $api.updateMatchState({
        matchId: "match",
        state: "NEW",
      }),
    ).rejects.toThrow("Cannot update a match back to NEW state");
  });

  it("should allow the media maker to move a project to SONG_REQUESTED ", async () => {
    cookies.set("sessionId", "mediamaker-session-id");

    const match = await prisma.match.findFirst({
      where: {
        songRequestId: "songRequestOneSubmission",
        musicId: "musicSubmission",
        matcherUserId: "sanjana",
      },
    });

    expect(match?.matcherUserId).toBe("matcher");

    // todo: show this is the mediamaker of this match
    const result = await $api.updateMatchState({
      matchId: "match",
      state: "SONG_REQUESTED",
    });

    expect((await result.match).matchState).toBe(MatchState.SONG_REQUESTED);
  });

  it("should allow the media maker to move a project to REJECTED_BY_MEDIA_MAKER ", async () => {
    cookies.set("sessionId", "mediamaker-session-id");

    const match = await prisma.match.findFirst({
      where: {
        songRequestId: "songRequestOneSubmission",
        musicId: "musicSubmission",
        matcherUserId: "sanjana",
      },
    });

    expect(match?.matcherUserId).toBe("matcher");

    const result = await $api.updateMatchState({
      matchId: "match",
      state: "NEW",
    });

    expect((await result.match).matchState).toBe(
      MatchState.REJECTED_BY_MEDIA_MAKER,
    );
  });

  it("should not allow a musician to move a project to a mediamaker-only category ", async () => {
    cookies.set("sessionId", "musician-session-id");
    expect(
      $api.updateMatchState({
        matchId: "match",
        state: "SONG_REQUESTED",
      }),
    ).rejects.toThrow(
      "This role does not have permission to perform the requested match state change",
    );
    expect(
      $api.updateMatchState({
        matchId: "match",
        state: "REJECTED_BY_MEDIA_MAKER",
      }),
    ).rejects.toThrow(
      "This role does not have permission to perform the requested match state change",
    );
  });

  it("should not allow an admin to move a project to a mediamaker-only category ", async () => {
    cookies.set("sessionId", "admin-session-id");
    expect(
      $api.updateMatchState({
        matchId: "match",
        state: "SONG_REQUESTED",
      }),
    ).rejects.toThrow(
      "This role does not have permission to perform the requested match state change",
    );
    expect(
      $api.updateMatchState({
        matchId: "match",
        state: "REJECTED_BY_MEDIA_MAKER",
      }),
    ).rejects.toThrow(
      "This role does not have permission to perform the requested match state change",
    );
  });

  it("should not allow a moderator to move a project to a mediamaker-only category ", async () => {
    cookies.set("sessionId", "moderator-session-id");
    expect(
      $api.updateMatchState({
        matchId: "match",
        state: "SONG_REQUESTED",
      }),
    ).rejects.toThrow(
      "This role does not have permission to perform the requested match state change",
    );
    expect(
      $api.updateMatchState({
        matchId: "match",
        state: "REJECTED_BY_MEDIA_MAKER",
      }),
    ).rejects.toThrow(
      "This role does not have permission to perform the requested match state change",
    );
  });
});
