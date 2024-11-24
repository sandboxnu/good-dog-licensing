import { afterEach, beforeAll, describe, expect, test } from "bun:test";

import { comparePassword, hashPassword } from "@good-dog/auth/password";
import { prisma } from "@good-dog/db";
import { $trpcCaller } from "@good-dog/trpc/server";

import { MockEmailService } from "../mocks/MockEmailService";
import { MockNextCookies } from "../mocks/MockNextCookies";

describe("forgot-password", () => {
  const mockCookies = new MockNextCookies();
  const mockEmails = new MockEmailService();

  const createAccount = async (email: string) =>
    prisma.user.upsert({
      create: {
        firstName: "Walter",
        lastName: "White",
        role: "MEDIA_MAKER",
        email: email,
        hashedPassword: await hashPassword("password123"),
      },
      update: {
        email: email,
        hashedPassword: await hashPassword("password123"),
      },
      where: {
        email: email,
      },
    });

  const cleanupAccount = async (email: string) => {
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

  const createPasswordResetRequest = async (
    userEmail: string,
    expiresAt: Date,
  ) =>
    prisma.passwordResetReq.create({
      data: {
        expiresAt: expiresAt,
        user: {
          connect: {
            email: userEmail,
          },
        },
      },
    });

  const cleanupPasswordResetRequest = async (userEmail: string) => {
    try {
      await prisma.passwordResetReq.deleteMany({
        where: {
          user: {
            email: userEmail,
          },
        },
      });
    } catch (error) {
      void error;
    }
  };

  beforeAll(async () => {
    await mockCookies.apply();
    await mockEmails.apply();
  });

  afterEach(() => {
    mockCookies.clear();
    mockEmails.clear();
  });

  describe("forgot-password/sendForgotPasswordEmail", () => {
    test("No user with given email", async () => {
      await cleanupPasswordResetRequest("walter@gmail.com");
      await cleanupAccount("walter@gmail.com");

      expect(
        $trpcCaller.sendForgotPasswordEmail({
          email: "walter@gmail.com",
        }),
      ).rejects.toThrow("No user found with given email.");

      expect(mockEmails.setApiKey).not.toBeCalled();
      expect(mockEmails.send).not.toBeCalled();
    });

    test("Valid user. No pending password reset request.", async () => {
      await cleanupPasswordResetRequest("walter@gmail.com");
      await createAccount("walter@gmail.com");

      const response = await $trpcCaller.sendForgotPasswordEmail({
        email: "walter@gmail.com",
      });

      expect(mockEmails.setApiKey).toBeCalled();
      expect(mockEmails.send).toBeCalled();

      expect(response.message).toBe(
        "Password reset email sent to walter@gmail.com.",
      );

      const user = await prisma.user.findUnique({
        where: {
          email: "walter@gmail.com",
        },
        include: {
          passwordResetReq: true,
        },
      });
      if (!user) {
        throw new Error("User should not be null.");
      }

      const passwordResetReq = await prisma.passwordResetReq.findMany({
        where: {
          user: user,
        },
      });
      if (!passwordResetReq[0]?.expiresAt) {
        throw new Error("There should be a password reset request.");
      }

      expect(passwordResetReq.length).toBe(1);
      expect(passwordResetReq[0]?.expiresAt > new Date()).toBe(true);
      expect(user.passwordResetReq?.passwordResetId).toBe(
        passwordResetReq[0].passwordResetId,
      );

      await cleanupAccount("walter@gmail.com");
      await cleanupPasswordResetRequest("walter@gmail.com");
    });

    test("Valid user. Pending password reset request.", async () => {
      await cleanupPasswordResetRequest("walter@gmail.com");
      await createAccount("walter@gmail.com");
      await createPasswordResetRequest(
        "walter@gmail.com",
        new Date(Date.now() + 60_000 * 100000),
      );

      const user = await prisma.user.findUnique({
        where: {
          email: "walter@gmail.com",
        },
      });
      if (!user) {
        throw new Error("User should not be null.");
      }
      let passwordResetReqs = await prisma.passwordResetReq.findMany({
        where: {
          user: user,
        },
      });
      expect(passwordResetReqs.length).toBe(1);

      const response = await $trpcCaller.sendForgotPasswordEmail({
        email: "walter@gmail.com",
      });

      expect(mockEmails.setApiKey).toBeCalled();
      expect(mockEmails.send).toBeCalled();

      expect(response.message).toBe(
        "Password reset email sent to walter@gmail.com.",
      );

      const userUpdated = await prisma.user.findUnique({
        where: {
          email: "walter@gmail.com",
        },
        include: {
          passwordResetReq: true,
        },
      });
      if (!userUpdated) {
        throw new Error("User should not be null.");
      }
      passwordResetReqs = await prisma.passwordResetReq.findMany({
        where: {
          user: userUpdated,
        },
      });
      if (!passwordResetReqs[0]?.expiresAt) {
        throw new Error("There should be a password reset request.");
      }

      expect(passwordResetReqs.length).toBe(1);
      expect(passwordResetReqs[0]?.expiresAt > new Date()).toBe(true);
      expect(userUpdated.passwordResetReq?.passwordResetId).toBe(
        passwordResetReqs[0].passwordResetId,
      );

      await cleanupAccount("walter@gmail.com");
      await cleanupPasswordResetRequest("walter@gmail.com");
    });
  });

  describe("forgot-password/confirmPasswordReset", () => {
    test("Given cuid doesn't exist", () => {
      expect(
        $trpcCaller.confirmPasswordReset({
          passwordResetId: "12345",
          newPassword: "password",
        }),
      ).rejects.toThrow("No password reset request found for given id.");
    });

    test("Password reset request is expired", async () => {
      await cleanupPasswordResetRequest("walter@gmail.com");
      await createAccount("walter@gmail.com");
      const passwordResetReq = await createPasswordResetRequest(
        "walter@gmail.com",
        new Date(Date.now() - 10000),
      );

      expect(
        $trpcCaller.confirmPasswordReset({
          passwordResetId: passwordResetReq.passwordResetId,
          newPassword: "password",
        }),
      ).rejects.toThrow("Password reset request is expired.");

      await cleanupAccount("walter@gmail.com");
      await cleanupPasswordResetRequest("walter@gmail.com");
    });

    test("Password reset request is valid", async () => {
      await cleanupPasswordResetRequest("walter@gmail.com");
      await createAccount("walter@gmail.com");
      const passwordResetReq = await createPasswordResetRequest(
        "walter@gmail.com",
        new Date(Date.now() + 60_000 * 100000),
      );

      const response = await $trpcCaller.confirmPasswordReset({
        passwordResetId: passwordResetReq.passwordResetId,
        newPassword: "newPassword",
      });

      expect(response.message).toBe("Password reset.");

      const user = await prisma.user.findUnique({
        where: {
          email: "walter@gmail.com",
        },
        include: {
          passwordResetReq: true,
        },
      });
      if (!user) {
        throw new Error("User should not be null.");
      }
      expect(await comparePassword("newPassword", user.hashedPassword)).toBe(
        true,
      );
      expect(user.passwordResetReq).toBe(null);

      const oldPasswordResetReq = await prisma.passwordResetReq.findUnique({
        where: {
          passwordResetId: passwordResetReq.passwordResetId,
        },
      });
      expect(oldPasswordResetReq).toBe(null);

      await cleanupAccount("walter@gmail.com");
      await cleanupPasswordResetRequest("walter@gmail.com");
    });
  });
});
