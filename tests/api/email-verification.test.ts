import { afterEach, describe, expect, test } from "bun:test";

import { prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockEmailService } from "../mocks/MockEmailService";
import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

describe("email-verification", () => {
  const mockCookies = new MockNextCookies();
  const mockEmails = new MockEmailService();

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(mockCookies),
    emailService: mockEmails,
    prisma: prisma,
  });

  const createEmailVerificationCode = async (emailConfirmed: boolean) =>
    prisma.emailVerificationCode.upsert({
      create: {
        email: "damian@gmail.com",
        code: "019821",
        expiresAt: new Date(Date.now() + 60_000 * 100000),
        emailConfirmed: emailConfirmed,
      },
      update: {
        code: "019821",
        expiresAt: new Date(Date.now() + 60_000 * 100000),
        emailConfirmed: emailConfirmed,
      },
      where: {
        email: "damian@gmail.com",
      },
    });

  const cleanupEmailVerificationCode = async () => {
    try {
      await prisma.emailVerificationCode.delete({
        where: {
          email: "damian@gmail.com",
        },
      });
    } catch (error) {
      void error;
    }
  };

  afterEach(() => {
    mockCookies.clear();
    mockEmails.clear();
  });

  describe("email-verification/sendEmailVerification", () => {
    test("Email is not in database", async () => {
      await cleanupEmailVerificationCode();

      const response = await $api.sendEmailVerification({
        email: "damian@gmail.com",
      });

      const emailVerificationCode =
        await prisma.emailVerificationCode.findUnique({
          where: {
            email: "damian@gmail.com",
          },
        });

      expect(mockEmails.send).toBeCalled();
      expect(mockEmails.generateSixDigitCode).toBeCalled();

      expect(emailVerificationCode?.email).toEqual("damian@gmail.com");
      expect(emailVerificationCode?.code).toEqual("123456");
      expect(emailVerificationCode?.emailConfirmed).toEqual(false);

      expect(response.message).toEqual(
        "Email verification code sent to damian@gmail.com",
      );

      await cleanupEmailVerificationCode();
    });

    test("Email sending error", async () => {
      await cleanupEmailVerificationCode();
      mockEmails.send.mockImplementationOnce(() => {
        throw new Error("Mock email failure.");
      });

      expect(
        $api.sendEmailVerification({
          email: "damian@gmail.com",
        }),
      ).rejects.toThrow(
        "Email confirmation to damian@gmail.com failed to send.",
      );

      expect(mockEmails.send).toBeCalled();
      expect(mockEmails.generateSixDigitCode).toBeCalled();

      await cleanupEmailVerificationCode();
    });

    test("Email is already in database (not verified)", async () => {
      await createEmailVerificationCode(false);

      const response = await $api.sendEmailVerification({
        email: "damian@gmail.com",
      });

      const emailVerificationCode =
        await prisma.emailVerificationCode.findUnique({
          where: {
            email: "damian@gmail.com",
          },
        });

      expect(mockEmails.send).toBeCalled();
      expect(mockEmails.generateSixDigitCode).toBeCalled();

      expect(emailVerificationCode?.email).toEqual("damian@gmail.com");
      expect(emailVerificationCode?.code).toEqual("123456");
      expect(emailVerificationCode?.emailConfirmed).toEqual(false);

      expect(response.message).toEqual(
        "Email verification code sent to damian@gmail.com",
      );
      expect(response.status).toEqual("EMAIL_SENT");

      await cleanupEmailVerificationCode();
    });

    test("Email is already in database (verified)", async () => {
      await createEmailVerificationCode(true);

      const response = await $api.sendEmailVerification({
        email: "damian@gmail.com",
      });

      expect(response.message).toEqual(
        "Email damian@gmail.com has already been verified",
      );
      expect(response.status).toEqual("ALREADY_VERIFIED");

      expect(mockEmails.send).not.toBeCalled();
      expect(mockEmails.generateSixDigitCode).not.toBeCalled();

      await cleanupEmailVerificationCode();
    });
  });

  describe("email-verification/confirmEmail", () => {
    test("Email already verified", async () => {
      await createEmailVerificationCode(true);

      const response = await $api.confirmEmail({
        email: "damian@gmail.com",
        code: "019821",
      });

      expect(response.status).toBe("SUCCESS");
    });

    test("No email verification code entry", async () => {
      await cleanupEmailVerificationCode();

      expect(
        $api.confirmEmail({
          email: "damian@gmail.com",
          code: "123456",
        }),
      ).rejects.toThrow("damian@gmail.com is not verified.");
    });

    test("Given code is incorrect", async () => {
      await createEmailVerificationCode(false);

      expect(
        $api.confirmEmail({
          email: "damian@gmail.com",
          code: "123456",
        }),
      ).rejects.toThrow("damian@gmail.com is not verified.");

      await cleanupEmailVerificationCode();
    });

    test("Given code is expired", async () => {
      await createEmailVerificationCode(false);
      const expiredDate = new Date(Date.now() + 60_000 * -15);

      await prisma.emailVerificationCode.update({
        where: {
          email: "damian@gmail.com",
        },
        data: {
          expiresAt: expiredDate,
        },
      });

      mockEmails.generateSixDigitCode.mockImplementationOnce(() => {
        return "987654";
      });

      const response = await $api.confirmEmail({
        email: "damian@gmail.com",
        code: "019821",
      });

      const emailVerificationCode =
        await prisma.emailVerificationCode.findUnique({
          where: {
            email: "damian@gmail.com",
          },
        });

      expect(mockEmails.send).toBeCalled();
      expect(mockEmails.generateSixDigitCode).toBeCalled();

      expect(emailVerificationCode?.email).toEqual("damian@gmail.com");
      expect(emailVerificationCode?.code).toEqual("987654");
      expect(emailVerificationCode?.emailConfirmed).toEqual(false);
      expect(emailVerificationCode?.expiresAt).not.toEqual(expiredDate);

      expect(response.status).toEqual("RESENT");

      await cleanupEmailVerificationCode();
    });

    test("Given code is valid", async () => {
      await createEmailVerificationCode(false);

      const response = await $api.confirmEmail({
        email: "damian@gmail.com",
        code: "019821",
      });

      const emailVerificationCode =
        await prisma.emailVerificationCode.findUnique({
          where: {
            email: "damian@gmail.com",
          },
        });

      expect(emailVerificationCode?.emailConfirmed).toBe(true);

      expect(response.message).toEqual(
        "Email was successfully verified. Email: damian@gmail.com.",
      );

      await cleanupEmailVerificationCode();
    });
  });
});
