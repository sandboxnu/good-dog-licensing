import { afterEach, describe, expect, test } from "bun:test";

import { passwordService } from "@good-dog/auth/password";
import { prisma } from "@good-dog/db";
import type { Role } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../../mocks/MockNextCookies";
import { createMockCookieService } from "../../mocks/util";

describe("activate-user", () => {
  const mockCookies = new MockNextCookies();

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(mockCookies),
    prisma: prisma,
    passwordService: passwordService,
  });

  const createAdmin = async () => {
    await prisma.user.create({
      data: {
        userId: "admin-user-id",
        email: "admin@gmail.com",
        hashedPassword: "xxxx",
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN",
        phoneNumber: "123-456-7890",
        active: true,
        sessions: {
          create: {
            sessionId: "admin-session-id",
            expiresAt: new Date(Date.now() + 5_000_000_000),
          },
        },
      },
    });
  };

  const createInactiveUser = async (email: string, role: Role) => {
    await prisma.user.create({
      data: {
        userId: `user-${role.toLowerCase()}-id`,
        email: email,
        hashedPassword: "xxxx",
        firstName: role,
        lastName: "User",
        role: role,
        phoneNumber: "123-456-7890",
        active: false,
      },
    });
  };

  const cleanupUsers = async (emails: string[]) => {
    await Promise.all(
      emails.map((email) =>
        prisma.user.deleteMany({
          where: { email },
        }),
      ),
    );
  };

  afterEach(async () => {
    mockCookies.clear();
    await cleanupUsers([
      "admin@gmail.com",
      "moderator@gmail.com",
      "media-maker@gmail.com",
      "user@gmail.com",
    ]);
  });

  describe("activateUser", () => {
    test("User does not exist.", async () => {
      await createAdmin();
      mockCookies.set("sessionId", "admin-session-id");

      expect(
        $api.activateUser({
          userId: "non-existent-user-id",
        }),
      ).rejects.toThrow("User does not exist");
    });

    test("Successfully activate moderator.", async () => {
      await createAdmin();
      await createInactiveUser("moderator@gmail.com", "MODERATOR");

      mockCookies.set("sessionId", "admin-session-id");

      const response = await $api.activateUser({
        userId: "user-moderator-id",
      });

      const activatedUser = await prisma.user.findUnique({
        where: {
          userId: "user-moderator-id",
        },
      });

      expect(activatedUser?.active).toBe(true);
      expect(response.message).toEqual("User successfully activated.");
    });

    test("Successfully activate media maker.", async () => {
      await createAdmin();
      await createInactiveUser("media-maker@gmail.com", "MEDIA_MAKER");

      mockCookies.set("sessionId", "admin-session-id");

      const response = await $api.activateUser({
        userId: "user-media_maker-id",
      });

      const activatedUser = await prisma.user.findUnique({
        where: {
          userId: "user-media_maker-id",
        },
      });

      expect(activatedUser?.active).toBe(true);
      expect(response.message).toEqual("User successfully activated.");
    });

    test("Activate already active user.", async () => {
      await createAdmin();

      const activeUser = await prisma.user.create({
        data: {
          userId: "active-user-id",
          email: "user@gmail.com",
          hashedPassword: "xxxx",
          firstName: "Active",
          lastName: "User",
          role: "MODERATOR",
          phoneNumber: "123-456-7890",
          active: true,
        },
      });

      mockCookies.set("sessionId", "admin-session-id");

      const response = await $api.activateUser({
        userId: activeUser.userId,
      });

      const user = await prisma.user.findUnique({
        where: {
          userId: activeUser.userId,
        },
      });

      expect(user?.active).toBe(true);
      expect(response.message).toEqual("User successfully activated.");
    });
  });
});
