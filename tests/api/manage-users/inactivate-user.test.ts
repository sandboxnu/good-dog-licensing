import { afterEach, describe, expect, test } from "bun:test";

import { passwordService } from "@good-dog/auth/password";
import type { Role } from "@good-dog/db";
import { prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../../mocks/MockNextCookies";
import { createMockCookieService } from "../../mocks/util";

describe("inactivate-user", () => {
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

  const createUser = async (email: string, role: Role) => {
    await prisma.user.create({
      data: {
        userId: `user-${role.toLowerCase()}-id`,
        email: email,
        hashedPassword: "xxxx",
        firstName: role,
        lastName: "User",
        role: role,
        phoneNumber: "123-456-7890",
        active: true,
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

  describe("inactivateUser", () => {
    test("User does not exist.", async () => {
      await createAdmin();
      mockCookies.set("sessionId", "admin-session-id");

      expect(
        $api.inactivateUser({
          userId: "non-existent-user-id",
        }),
      ).rejects.toThrow("User does not exist");
    });

    test("Successfully inactivate moderator.", async () => {
      await createAdmin();
      await createUser("moderator@gmail.com", "MODERATOR");

      mockCookies.set("sessionId", "admin-session-id");

      const response = await $api.inactivateUser({
        userId: "user-moderator-id",
      });

      const inactivatedUser = await prisma.user.findUnique({
        where: {
          userId: "user-moderator-id",
        },
      });

      expect(inactivatedUser?.active).toBe(false);
      expect(response.message).toEqual("User successfully inactivated.");
    });

    test("Successfully inactivate media maker.", async () => {
      await createAdmin();
      await createUser("media-maker@gmail.com", "MEDIA_MAKER");

      mockCookies.set("sessionId", "admin-session-id");

      const response = await $api.inactivateUser({
        userId: "user-media_maker-id",
      });

      const inactivatedUser = await prisma.user.findUnique({
        where: {
          userId: "user-media_maker-id",
        },
      });

      expect(inactivatedUser?.active).toBe(false);
      expect(response.message).toEqual("User successfully inactivated.");
    });

    test("Inactivate already inactive user.", async () => {
      await createAdmin();

      const inactiveUser = await prisma.user.create({
        data: {
          userId: "inactive-user-id",
          email: "user@gmail.com",
          hashedPassword: "xxxx",
          firstName: "Inactive",
          lastName: "User",
          role: "MODERATOR",
          phoneNumber: "123-456-7890",
          active: false,
        },
      });

      mockCookies.set("sessionId", "admin-session-id");

      const response = await $api.inactivateUser({
        userId: inactiveUser.userId,
      });

      const user = await prisma.user.findUnique({
        where: {
          userId: inactiveUser.userId,
        },
      });

      expect(user?.active).toBe(false);
      expect(response.message).toEqual("User successfully inactivated.");
    });
  });
});
