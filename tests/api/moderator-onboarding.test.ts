import { afterEach, describe, expect, test } from "bun:test";

import { passwordService } from "@good-dog/auth/password";
import { prisma } from "@good-dog/db";
import { env } from "@good-dog/env";
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
    await prisma.user.deleteMany({
      where: {
        email: "jordan@gmail.com",
      },
    });
  };

  const cleanupUser = async (email: string) => {
    await prisma.user.deleteMany({
      where: {
        email: email,
      },
    });
  };

  const cleanupModeratorInvites = async (email: string) => {
    await prisma.moderatorInvite.deleteMany({
      where: {
        email: email,
      },
    });
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

  const getBaseUrl = () => {
    let baseURL = "http://localhost:3000";
    if (env.VERCEL_URL) {
      baseURL = `https://${env.VERCEL_URL}`;
    }

    return baseURL;
  };

  afterEach(async () => {
    mockCookies.clear();
    mockEmails.clear();
    await Promise.all([
      cleanupModeratorInvites("testing@gmail.com"),
      cleanupModeratorInvites("test@gmail.com"),
      cleanupAdmin(),
      cleanupUser("test@gmail.com"),
    ]);
  });

  describe("moderator-onboarding/sendModeratorInvite", () => {
    test("No pending moderator invite.", async () => {
      await createAdmin();

      mockCookies.set("sessionId", "jordan-session-id");

      const response = await $api.sendModeratorInviteEmail({
        moderatorEmail: "testing@gmail.com",
      });

      const moderatorInvite = await prisma.moderatorInvite.findUnique({
        where: {
          email: "testing@gmail.com",
        },
      });

      expect(mockEmails.send).toHaveBeenCalledWith({
        to: "testing@gmail.com",
        subject: "Sign Up For PR - Good Dog Licensing",
        html: `<p>Follow <a href="${getBaseUrl()}/pr_invite/?id=${moderatorInvite?.moderatorInviteId}">this link</a> to sign up as a PR.`,
        from: env.VERIFICATION_FROM_EMAIL ?? "",
      });

      expect(moderatorInvite?.email).toEqual("testing@gmail.com");

      expect(response.message).toEqual(
        "Moderator Invite sent to testing@gmail.com",
      );
    });

    test("Pending moderator invite.", async () => {
      await createAdmin();
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

      expect(mockEmails.send).toHaveBeenCalledWith({
        to: "testing@gmail.com",
        subject: "Sign Up For PR - Good Dog Licensing",
        html: `<p>Follow <a href="${getBaseUrl()}/pr_invite/?id=${newModeratorInvite?.moderatorInviteId}">this link</a> to sign up as a PR.`,
        from: env.VERIFICATION_FROM_EMAIL ?? "",
      });

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
    });

    test("Email sending error.", async () => {
      await createAdmin();

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

      const moderatorInvite = await prisma.moderatorInvite.findUnique({
        where: {
          email: "testing@gmail.com",
        },
      });

      expect(mockEmails.send).toHaveBeenCalledWith({
        to: "testing@gmail.com",
        subject: "Sign Up For PR - Good Dog Licensing",
        html: `<p>Follow <a href="${getBaseUrl()}/pr_invite/?id=${moderatorInvite?.moderatorInviteId}">this link</a> to sign up as a PR.`,
        from: env.VERIFICATION_FROM_EMAIL ?? "",
      });
    });
  });

  describe("moderator-onboarding/onboardModerator", () => {
    test("No moderator invite in database.", () => {
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

    test("Moderator invite is expired. Email send works.", async () => {
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

      expect(mockEmails.send).toHaveBeenCalledWith({
        to: "testing@gmail.com",
        subject: "Sign Up For PR - Good Dog Licensing",
        html: `<p>Follow <a href="${getBaseUrl()}/pr_invite/?id=${newModeratorInvite?.moderatorInviteId}">this link</a> to sign up as a PR.`,
        from: env.VERIFICATION_FROM_EMAIL ?? "",
      });

      expect(newModeratorInvite?.email).toEqual("testing@gmail.com");
      expect(newModeratorInvite?.email).toEqual(expiredInvite.email);
      expect(newModeratorInvite?.moderatorInviteId).not.toEqual(
        expiredInvite.moderatorInviteId,
      );
      expect(newModeratorInvite?.expiresAt).not.toEqual(
        expiredInvite.expiresAt,
      );
      expect(newModeratorInvite?.createdAt).not.toEqual(
        expiredInvite.createdAt,
      );

      expect(response.message).toEqual(
        "Invite is expired. A new invite was sent to testing@gmail.com.",
      );
      expect(response.status).toEqual("RESENT");
    });

    test("Moderator invite is expired. Email send fails.", async () => {
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
      expect(mockEmails.send).toHaveBeenCalledWith({
        to: "testing@gmail.com",
        subject: "Sign Up For PR - Good Dog Licensing",
        html: `<p>Follow <a href="${getBaseUrl()}/pr_invite/?id=${newModeratorInvite?.moderatorInviteId}">this link</a> to sign up as a PR.`,
        from: env.VERIFICATION_FROM_EMAIL ?? "",
      });
    });

    test("Moderator invite is valid.", async () => {
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
    });
  });
});
