import { afterEach, describe, expect, test } from "bun:test";

import { passwordService } from "@good-dog/auth/password";
import { prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockEmailService } from "../mocks/MockEmailService";
import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

describe("moderator-onboarding", () => {
  const mockEmails = new MockEmailService();
  const mockCookies = new MockNextCookies();

  const $api = $createTrpcCaller({
    emailService: mockEmails,
    prisma: prisma,
    cookiesService: createMockCookieService(mockCookies),
    passwordService: passwordService,
  });

  const createAdmin = async () => {
    await prisma.user.create({
      data: {
        userId: "jordan-user-id",
        email: "jordan@gmail.com",
        hashedPassword: "xxxx",
        firstName: "Jordan",
        lastName: "TestPerson",
        role: "ADMIN",
        phoneNumber: "123-456-7890",
        sessions: {
          create: {
            sessionId: "jordan-session-id",
            expiresAt: new Date(Date.now() + 5_000_000_000),
          },
        },
      },
    });
  };

  const cleanupAdmin = async () => {
    try {
      await prisma.user.delete({
        where: {
          email: "jordan@gmail.com",
        },
      });
    } catch (error) {
      void error;
    }
  };

  const cleanupUser = async (email: string) => {
    try {
      await prisma.user.delete({
        where: {
          email: email,
        },
      });
    } catch (error) {
      void error;
    }
  };

  const cleanupModeratorInvites = async (email: string) => {
    try {
      await prisma.moderatorInvite.delete({
        where: {
          email: email,
        },
      });
    } catch (error) {
      void error;
    }
  };

  const createModeratorInvite = async (email: string, expiresAt: Date) => {
    const moderatorInvite = await prisma.moderatorInvite.create({
      data: {
        email: email,
        expiresAt: expiresAt,
      },
    });

    return moderatorInvite;
  };

  afterEach(() => {
    mockCookies.clear();
    mockEmails.clear();
  });

  describe("moderator-onboarding/sendModeratorInvite", () => {
    test("No pending moderator invite.", async () => {
      await cleanupAdmin();
      await createAdmin();
      await cleanupModeratorInvites("testing@gmail.com");

      mockCookies.set("sessionId", "jordan-session-id");

      const response = await $api.sendModeratorInviteEmail({
        moderatorEmail: "testing@gmail.com",
      });

      const moderatorInvite = await prisma.moderatorInvite.findUnique({
        where: {
          email: "testing@gmail.com",
        },
      });

      expect(mockEmails.send).toBeCalled();

      expect(moderatorInvite?.email).toEqual("testing@gmail.com");

      expect(response.message).toEqual(
        "Moderator Invite sent to testing@gmail.com",
      );

      await cleanupModeratorInvites("testing@gmail.com");
      await cleanupAdmin();
    });

    test("Pending moderator invite.", async () => {
      await cleanupAdmin();
      await createAdmin();
      await cleanupModeratorInvites("testing@gmail.com");
      const oldModeratorInvite = await createModeratorInvite(
        "testing@gmail.com",
        new Date(Date.now() - 15 * 60 * 1000),
      );

      mockCookies.set("sessionId", "jordan-session-id");

      const response = await $api.sendModeratorInviteEmail({
        moderatorEmail: "testing@gmail.com",
      });

      const newModeratorInvite = await prisma.moderatorInvite.findUnique({
        where: {
          email: "testing@gmail.com",
        },
      });

      expect(mockEmails.send).toBeCalled();

      expect(newModeratorInvite?.email).toEqual("testing@gmail.com");
      expect(newModeratorInvite?.email).toEqual(oldModeratorInvite.email);
      expect(newModeratorInvite?.moderatorInviteId).not.toEqual(
        oldModeratorInvite.moderatorInviteId,
      );
      expect(newModeratorInvite?.expiresAt).not.toEqual(
        oldModeratorInvite.expiresAt,
      );
      expect(newModeratorInvite?.createdAt).not.toEqual(
        oldModeratorInvite.createdAt,
      );

      expect(response.message).toEqual(
        "Moderator Invite sent to testing@gmail.com",
      );

      await cleanupModeratorInvites("testing@gmail.com");
      await cleanupAdmin();
    });

    test("Email sending error.", async () => {
      await cleanupAdmin();
      await createAdmin();
      await cleanupModeratorInvites("testing@gmail.com");

      mockCookies.set("sessionId", "jordan-session-id");

      mockEmails.send.mockImplementationOnce(() => {
        throw new Error("Mock email failure.");
      });
      expect(
        $api.sendModeratorInviteEmail({
          moderatorEmail: "testing@gmail.com",
        }),
      ).rejects.toThrow(
        "Moderator Invite Email to testing@gmail.com failed to send.",
      );

      expect(mockEmails.send).toBeCalled();

      await cleanupAdmin();
    });
  });

  describe("moderator-onboarding/onboardModerator", () => {
    test("No moderator invite in database.", async () => {
      await cleanupModeratorInvites("testing@gmail.com");

      expect(
        $api.onboardModerator({
          moderatorInviteId: "1",
          firstName: "Jordan",
          lastName: "GoodDog",
          phoneNumber: "123-456-7890",
          password: "mypassword",
        }),
      ).rejects.toThrow("FORBIDDEN");
    });
  });

  test("Moderator invite is expired. Email send works.", async () => {
    await cleanupModeratorInvites("testing@gmail.com");
    const expiredInvite = await createModeratorInvite(
      "testing@gmail.com",
      new Date(Date.now() - 15 * 60 * 1000),
    );

    const response = await $api.onboardModerator({
      moderatorInviteId: expiredInvite.moderatorInviteId,
      firstName: "Jordan",
      lastName: "GoodDog",
      phoneNumber: "123-456-7890",
      password: "mypassword",
    });

    const newModeratorInvite = await prisma.moderatorInvite.findUnique({
      where: {
        email: "testing@gmail.com",
      },
    });

    expect(mockEmails.send).toBeCalled();

    expect(newModeratorInvite?.email).toEqual("testing@gmail.com");
    expect(newModeratorInvite?.email).toEqual(expiredInvite.email);
    expect(newModeratorInvite?.moderatorInviteId).not.toEqual(
      expiredInvite.moderatorInviteId,
    );
    expect(newModeratorInvite?.expiresAt).not.toEqual(expiredInvite.expiresAt);
    expect(newModeratorInvite?.createdAt).not.toEqual(expiredInvite.createdAt);

    expect(response.message).toEqual(
      "Invite is expired. A new invite was sent to testing@gmail.com.",
    );
    expect(response.status).toEqual("RESENT");

    await cleanupModeratorInvites("testing@gmail.com");
  });

  test("Moderator invite is expired. Email send fails.", async () => {
    await cleanupModeratorInvites("testing@gmail.com");
    const expiredInvite = await createModeratorInvite(
      "testing@gmail.com",
      new Date(Date.now() - 15 * 60 * 1000),
    );

    mockEmails.send.mockImplementationOnce(() => {
      throw new Error("Mock email failure.");
    });
    expect(
      $api.onboardModerator({
        moderatorInviteId: expiredInvite.moderatorInviteId,
        firstName: "Jordan",
        lastName: "GoodDog",
        phoneNumber: "123-456-7890",
        password: "mypassword",
      }),
    ).rejects.toThrow(
      "Moderator Invite Email to testing@gmail.com failed to resend.",
    );

    const newModeratorInvite = await prisma.moderatorInvite.findUnique({
      where: {
        email: "testing@gmail.com",
      },
    });

    expect(newModeratorInvite?.moderatorInviteId).not.toEqual(
      expiredInvite.moderatorInviteId,
    );
    expect(mockEmails.send).toBeCalled();
  });

  test("Moderator invite is valid.", async () => {
    await cleanupModeratorInvites("test@gmail.com");
    await cleanupUser("test@gmail.com");
    const moderatorInvite = await createModeratorInvite(
      "test@gmail.com",
      new Date(Date.now() + 15 * 60 * 1000),
    );

    const response = await $api.onboardModerator({
      moderatorInviteId: moderatorInvite.moderatorInviteId,
      firstName: "Jordan",
      lastName: "GoodDog",
      phoneNumber: "123-456-7890",
      password: "mypassword",
    });

    const moderatorUser = await prisma.user.findUnique({
      where: {
        email: "test@gmail.com",
      },
    });
    const newModeratorInvite = await prisma.moderatorInvite.findUnique({
      where: {
        moderatorInviteId: moderatorInvite.moderatorInviteId,
      },
    });
    expect(newModeratorInvite).toBe(null);

    expect(mockEmails.send).not.toBeCalled();

    expect(moderatorUser?.firstName).toEqual("Jordan");
    expect(moderatorUser?.lastName).toEqual("GoodDog");
    expect(moderatorUser?.role).toEqual("MODERATOR");
    expect(moderatorUser?.email).toEqual("test@gmail.com");
    expect(moderatorUser?.phoneNumber).toEqual("123-456-7890");

    expect(response.message).toEqual(
      "Successfully signed up and logged in as test@gmail.com.",
    );
    expect(response.status).toEqual("SUCCESS");

    await cleanupUser("test@gmail.com");
  });
});
