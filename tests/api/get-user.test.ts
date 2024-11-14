import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "bun:test";

import { prisma } from "@good-dog/db";
import { $trpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";

describe("get user", () => {
  // Seeds the database before running the tests
  beforeAll(async () => {
    await prisma.$transaction([
      prisma.user.create({
        data: {
          userId: "owen-user-id",
          email: "owen@test.org",
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
          userId: "isabelle-user-id",
          email: "isabelle@test.org",
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

  beforeAll(async () => {
    await cookies.apply();
  });

  afterEach(() => {
    cookies.clear();
  });

  // Delete the records created for these tests
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        userId: {
          in: ["owen-user-id", "isabelle-user-id"],
        },
      },
    });
  });

  test("Null is returned when the user does not have a session cookie", async () => {
    const user = await $trpcCaller.user();

    expect(user).toBeNull();
  });

  test("Null is returned when the session has expired", async () => {
    cookies.set("sessionId", "isabelle-session-id");

    const user = await $trpcCaller.user();

    expect(user).toBeNull();
  });

  test("Null is returned when the session is invalid", async () => {
    cookies.set("sessionId", "invalid-session-id");

    const user = await $trpcCaller.user();

    expect(user).toBeNull();
  });

  test("Correct user is returned when they have a valid session.", async () => {
    cookies.set("sessionId", "owen-session-id");

    const user = await $trpcCaller.user();

    expect(user).not.toBeNull();
    if (user) {
      expect(user.email).toEqual("owen@test.org");
    }
  });
});
