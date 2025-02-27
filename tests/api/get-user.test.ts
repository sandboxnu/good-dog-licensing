import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "bun:test";

import { prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

describe("get user", () => {
  // Seeds the database before running the tests
  beforeAll(async () => {
    await prisma.$transaction([
      prisma.user.create({
        data: {
          userId: "owen-user-id",
          email: "owen@test.org",
          phoneNumber: "1234567890",
          hashedPassword: "xxxx",
          firstName: "Owen",
          lastName: "Simpson",
          role: "ADMIN",
          sessions: {
            create: {
              sessionId: "owen-session-id",
              expiresAt: new Date(Date.now() + 5_000_000_000),
            },
          },
        },
      }),
      prisma.user.create({
        data: {
          userId: "gavin-user-id",
          email: "gavin@test.org",
          phoneNumber: "4173843849",
          hashedPassword: "xxxx",
          firstName: "Gavin",
          lastName: "Normand",
          role: "MEDIA_MAKER",
          sessions: {
            create: {
              sessionId: "gavin-session-id",
              expiresAt: new Date(Date.now() + 600_000),
            },
          },
        },
      }),
      prisma.user.create({
        data: {
          userId: "isabelle-user-id",
          email: "isabelle@test.org",
          phoneNumber: "2345678901",
          hashedPassword: "xxxx",
          firstName: "Isabelle",
          lastName: "Papa",
          role: "ADMIN",
          sessions: {
            create: {
              sessionId: "isabelle-session-id",
              expiresAt: new Date(Date.now() - 5_000_000_000),
            },
          },
        },
      }),
    ]);
  });

  const cookies = new MockNextCookies();

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(cookies),
    prisma: prisma,
  });

  afterEach(() => {
    cookies.clear();
  });

  // Delete the records created for these tests
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        userId: {
          in: ["owen-user-id", "isabelle-user-id", "gavin-user-id"],
        },
      },
    });
  });

  test("Null is returned when the user does not have a session cookie", async () => {
    const user = await $api.user();

    expect(user).toBeNull();
  });

  test("Null is returned when the session has expired", async () => {
    cookies.set("sessionId", "isabelle-session-id");

    const user = await $api.user();

    expect(user).toBeNull();
  });

  test("Null is returned when the session is invalid", async () => {
    cookies.set("sessionId", "invalid-session-id");

    const user = await $api.user();

    expect(user).toBeNull();
  });

  test("Correct user is returned when they have a valid session.", async () => {
    cookies.set("sessionId", "owen-session-id");

    const user = await $api.user();

    expect(user).not.toBeNull();
    if (user) {
      expect(user.email).toEqual("owen@test.org");
      expect(user.session.refreshRequired).toBeFalse();
    }
  });

  test("User with session.refreshRequired", async () => {
    cookies.set("sessionId", "gavin-session-id");

    const user = await $api.user();

    expect(user).not.toBeNull();
    if (user) {
      expect(user.email).toEqual("gavin@test.org");
      expect(user.session.refreshRequired).toBeTrue();
      expect(user.phoneNumber).toEqual("4173843849");
    }
  });
});
