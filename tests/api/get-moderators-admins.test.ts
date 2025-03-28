import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

describe("get-moderators-admins", () => {
  const createData = async () => {
    await prisma.$transaction([
      prisma.user.create({
        data: {
          userId: "gavin-user-id",
          email: "gavin@test.org",
          phoneNumber: "4173843849",
          hashedPassword: "xxxx",
          firstName: "Gavin",
          lastName: "Normand",
          role: "MODERATOR",
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
          userId: "amoli-user-id",
          email: "amoli@test.org",
          phoneNumber: "1987654323",
          hashedPassword: "xxxx",
          firstName: "Amoli",
          lastName: "Patel",
          role: "MEDIA_MAKER",
          sessions: {
            create: {
              sessionId: "amoli-session-id",
              expiresAt: new Date(Date.now() + 600_000),
            },
          },
        },
      }),
      prisma.user.create({
        data: {
          userId: "jordan-user-id",
          email: "jordan@test.org",
          phoneNumber: "1987654323",
          hashedPassword: "xxxx",
          firstName: "Jordan",
          lastName: "Praissman",
          role: "MUSICIAN",
          sessions: {
            create: {
              sessionId: "jordan-session-id",
              expiresAt: new Date(Date.now() + 600_000),
            },
          },
        },
      }),
      prisma.moderatorInvite.create({
        data: {
          email: "sanjana@test.org",
          expiresAt: new Date(Date.now() + 600_000),
        },
      }),
      prisma.moderatorInvite.create({
        data: {
          email: "anzhuo@test.org",
          expiresAt: new Date(Date.now() - 600_000),
        },
      }),
    ]);
  };

  const deleteData = async () => {
    await prisma.$transaction([
      prisma.user.deleteMany({}),
      prisma.moderatorInvite.deleteMany({}),
    ]);
  };

  const cookies = new MockNextCookies();

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(cookies),
    prisma: prisma,
  });

  beforeEach(async () => {
    await prisma.user.create({
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
    });
  });

  afterEach(async () => {
    cookies.clear();
    await deleteData();
  });

  test("There are users to return and admin making request", async () => {
    await createData();
    cookies.set("sessionId", "owen-session-id");
    const users = await $api.getModeratorsAndAdmins();

    const expectedResult = [
      { role: "MODERATOR", status: "ACTIVE", email: "gavin@test.org" },
      { role: "ADMIN", status: "ACTIVE", email: "owen@test.org" },
      { role: "MODERATOR", status: "PENDING", email: "sanjana@test.org" },
    ];

    expect(users).toEqual(expectedResult);
  });

  test("Not admin making request", async () => {
    await createData();
    cookies.set("sessionId", "gavin-session-id");
    expect($api.getModeratorsAndAdmins()).rejects.toThrow("FORBIDDEN");
  });

  test("There is one user to return and admin making request", async () => {
    cookies.set("sessionId", "owen-session-id");

    const users = await $api.getModeratorsAndAdmins();

    const expectedResult = [
      { role: "ADMIN", status: "ACTIVE", email: "owen@test.org" },
    ];

    expect(users).toEqual(expectedResult);
  });
});
