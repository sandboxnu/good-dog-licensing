import { afterEach, describe, expect, test } from "bun:test";

import { passwordService } from "@good-dog/auth/password";
import { prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../../mocks/MockNextCookies";
import { createMockCookieService } from "../../mocks/util";

describe("promote-to-admin", () => {
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

  const createModerator = async () => {
    await prisma.user.create({
      data: {
        userId: "moderator-user-id",
        email: "moderator@gmail.com",
        hashedPassword: "xxxx",
        firstName: "Moderator",
        lastName: "User",
        role: "MODERATOR",
        phoneNumber: "123-456-7890",
        active: true,
      },
    });
  };

  const cleanupUsers = async () => {
    await Promise.all([
      prisma.user.deleteMany({
        where: {
          email: "admin@gmail.com",
        },
      }),
      prisma.user.deleteMany({
        where: {
          email: "moderator@gmail.com",
        },
      }),
    ]);
  };

  afterEach(async () => {
    mockCookies.clear();
    await cleanupUsers();
  });

  describe("promoteToAdmin", () => {
    test("User does not exist.", async () => {
      await createAdmin();
      mockCookies.set("sessionId", "admin-session-id");

      expect(
        $api.promoteToAdmin({
          userId: "non-existent-user-id",
        }),
      ).rejects.toThrow("User does not exist");
    });

    test("User is not a moderator.", async () => {
      await createAdmin();

      const mediaMaker = await prisma.user.create({
        data: {
          userId: "media-maker-user-id",
          email: "mediamaker@gmail.com",
          hashedPassword: "xxxx",
          firstName: "Media",
          lastName: "Maker",
          role: "MEDIA_MAKER",
          phoneNumber: "123-456-7890",
          active: true,
        },
      });

      mockCookies.set("sessionId", "admin-session-id");

      expect(
        $api.promoteToAdmin({
          userId: mediaMaker.userId,
        }),
      ).rejects.toThrow("Only P&R reps can be promoted to admins.");

      await prisma.user.deleteMany({
        where: {
          email: "mediamaker@gmail.com",
        },
      });
    });

    test("Admin cannot be promoted.", async () => {
      await createAdmin();

      const anotherAdmin = await prisma.user.create({
        data: {
          userId: "another-admin-id",
          email: "another-admin@gmail.com",
          hashedPassword: "xxxx",
          firstName: "Another",
          lastName: "Admin",
          role: "ADMIN",
          phoneNumber: "123-456-7890",
          active: true,
        },
      });

      mockCookies.set("sessionId", "admin-session-id");

      expect(
        $api.promoteToAdmin({
          userId: anotherAdmin.userId,
        }),
      ).rejects.toThrow("Only P&R reps can be promoted to admins.");

      await prisma.user.deleteMany({
        where: {
          email: "another-admin@gmail.com",
        },
      });
    });

    test("Successfully promote moderator to admin.", async () => {
      await createAdmin();
      await createModerator();

      mockCookies.set("sessionId", "admin-session-id");

      const response = await $api.promoteToAdmin({
        userId: "moderator-user-id",
      });

      const promotedUser = await prisma.user.findUnique({
        where: {
          userId: "moderator-user-id",
        },
      });

      expect(promotedUser?.role).toBe("ADMIN");
      expect(response.message).toEqual("User successfully promoted to admin.");
    });
  });
});
