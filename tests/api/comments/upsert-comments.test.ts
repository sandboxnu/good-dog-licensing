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
import {
  createData,
  createMoreData,
  deleteData,
} from "../matches/match-data-functions";

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
    cookies.set("sessionId", "admin-session-id");

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
    cookies.set("sessionId", "admin-session-id");

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
    cookies.set("sessionId", "admin-session-id");

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
