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
import { createData, deleteData } from "./match-data-functions";

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

  it("should allow a moderator to create a match", async () => {
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

  it("should allow an admin to create a match", async () => {
    cookies.set("sessionId", "admin-session-id");

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
    expect(match?.matchState).toBe(MatchState.NEW);
    expect(match?.songRequestId).toBe("songRequestOneSubmission");
    expect(match?.musicId).toBe("musicSubmission");
    expect(match?.matcherUserId).toBe("sanjana");
  });

  it("should throw error when given invalid songRequestId", () => {
    cookies.set("sessionId", "admin-session-id");

    expect(
      $api.createMatch({
        songRequestId: "songRequestOneSubmission",
        musicId: "invalid",
      }),
    ).rejects.toThrow("Foreign key constraint violated");
  });

  it("should throw error when given invalid musicId", () => {
    cookies.set("sessionId", "admin-session-id");

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
    cookies.set("sessionId", "mediamaker-session-id");

    expect(
      $api.createMatch({
        songRequestId: "songRequestOneSubmission",
        musicId: "musicSubmission",
      }),
    ).rejects.toThrow("permission to modify");
  });
});
