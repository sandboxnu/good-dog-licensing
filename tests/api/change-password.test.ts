import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "bun:test";

import { passwordService } from "@good-dog/auth/password";
import { MusicAffiliation, prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

describe("change profile values", () => {
  beforeAll(async () => {
    await prisma.$transaction([
      prisma.user.create({
        data: {
          userId: "owen-user-id",
          email: "owen@test.org",
          phoneNumber: "1234567890",
          hashedPassword: "12345678A!",
          firstName: "Owen",
          lastName: "Simpson",
          role: "ADMIN",
          sessions: {
            create: {
              sessionId: "owen-session-id",
              expiresAt: new Date(Date.now() + 5_000_000_000),
            },
          },
          affiliation: MusicAffiliation.ASCAP,
          ipi: "has",
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
          affiliation: MusicAffiliation.NONE,
        },
      }),
      prisma.user.create({
        data: {
          userId: "wesley-user-id",
          email: "wesley@test.org",
          phoneNumber: "6268221322",
          hashedPassword: "xxxx",
          firstName: "Wesley",
          lastName: "Tran",
          role: "MUSICIAN",
          sessions: {
            create: {
              sessionId: "wesley-session-id",
              expiresAt: new Date(Date.now() + 600_000),
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
    passwordService: passwordService,
  });

  afterEach(() => {
    cookies.clear();
  });

  // Delete the records created for these tests
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        userId: {
          in: ["owen-user-id", "wesley-user-id", "gavin-user-id"],
        },
      },
    });
  });

  test("User has to be logged in to change passwords", async () => {
    expect(
      $api.changePassword({
        newPassword: "87654321A!",
      }),
    ).rejects.toThrow("UNAUTHORIZED");
  });

  test("Change password to a valid password", async () => {
    cookies.set("sessionId", "gavin-session-id");

    const message = await $api.changePassword({
      newPassword: "87654321A!",
    });

    expect(message.message).toBe("Password reset.");
    const updatedUser = await prisma.user.findUnique({
      where: { userId: "gavin-user-id" },
    });

    const isValid = await passwordService.comparePassword(
      "87654321A!",
      updatedUser!.hashedPassword,
    );
    expect(isValid).toBe(true);
  });

  test("Can change password to anything using the procedure", async () => {
    cookies.set("sessionId", "wesley-session-id");

    const message = await $api.changePassword({
      newPassword: "any", // less than 8 char, no capital, no special char
    });

    expect(message.message).toBe("Password reset.");
    const updatedUser = await prisma.user.findUnique({
      where: { userId: "wesley-user-id" },
    });

    const isValid = await passwordService.comparePassword(
      "any",
      updatedUser!.hashedPassword,
    );
    expect(isValid).toBe(true);
  });

  test("Can change password and then sign in with new password (integration test)", async () => {
    cookies.set("sessionId", "owen-session-id");

    const message = await $api.changePassword({
      newPassword: "87654321A!",
    });

    expect(message.message).toBe("Password reset.");
    cookies.clear(); // sign out to verify passwords changed
    expect(
      // expect the old password to reject
      $api.signIn({ email: "owen@test.org", password: "xxxx" }),
    ).rejects.toThrow();
    expect(
      // try the new password
      $api.signIn({ email: "owen@test.org", password: "87654321A!" }),
    ).resolves.toBeDefined();
  });
});
