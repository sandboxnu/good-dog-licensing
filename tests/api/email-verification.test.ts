import { cookies } from "next/headers";
import { afterEach, beforeAll, describe, expect, test } from "bun:test";

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

  const createEmailVerificationCode = async ({
    emailConfirmed,
  }: {
    emailConfirmed: boolean;
  }) =>
    prisma.emailVerificationCode.create({
      data: {
        email: "owen@test.gov",
        code: "019821",
        expiresAt: new Date(Date.now() + 60_000 * 100000),
        emailConfirmed: emailConfirmed,
      },
    });

  beforeAll(async () => {
    await prisma.user.create({
      data: {
        firstName: "Owen",
        lastName: "Smith",
        hashedPassword: "fiadsfjasif",
        role: "MEDIA_MAKER",
        email: "owen@test.gov",
        phoneNumber: "1234567890",
        sessions: {
          create: {
            expiresAt: new Date("2099-01-01"),
            sessionId: "1234567890",
          },
        },
      },
    });
  });

  afterEach(async () => {
    mockCookies.clear();
    mockEmails.clear();

    // delete many used to prevent error if email verification code does not exist
    await prisma.emailVerificationCode.deleteMany({
      where: {
        email: "owen@test.gov",
      },
    });
  });

  describe("email-verification/sendEmailVerification", () => {
    test("Email is not in database", async () => {
      mockCookies.set("sessionId", "1234567890");
      const response = await $api.sendEmailVerification();

      const emailVerificationCode =
        await prisma.emailVerificationCode.findUnique({
          where: {
            email: "owen@test.gov",
          },
        });

      expect(mockEmails.send).toBeCalled();
      expect(mockEmails.generateSixDigitCode).toBeCalled();

      expect(emailVerificationCode?.email).toEqual("owen@test.gov");
      expect(emailVerificationCode?.code).toEqual("123456");
      expect(emailVerificationCode?.emailConfirmed).toEqual(false);

      expect(response.message).toEqual(
        "Email verification code sent to owen@test.gov",
      );
    });

    test("Email sending error", () => {
      mockCookies.set("sessionId", "1234567890");
      mockEmails.send.mockImplementationOnce(() => {
        throw new Error("Mock email failure.");
      });

      expect($api.sendEmailVerification()).rejects.toThrow(
        "Email confirmation to owen@test.gov failed to send.",
      );

      expect(mockEmails.send).toBeCalled();
      expect(mockEmails.generateSixDigitCode).toBeCalled();
    });

    test("Email is already in database (not verified)", async () => {
      mockCookies.set("sessionId", "1234567890");
      await createEmailVerificationCode({ emailConfirmed: false });

      const response = await $api.sendEmailVerification();

      const emailVerificationCode =
        await prisma.emailVerificationCode.findUnique({
          where: {
            email: "owen@test.gov",
          },
        });

      expect(mockEmails.send).toBeCalled();
      expect(mockEmails.generateSixDigitCode).toBeCalled();

      expect(emailVerificationCode?.email).toEqual("owen@test.gov");
      expect(emailVerificationCode?.code).toEqual("123456");
      expect(emailVerificationCode?.emailConfirmed).toEqual(false);

      expect(response.message).toEqual(
        "Email verification code sent to owen@test.gov",
      );
      expect(response.status).toEqual("EMAIL_SENT");
    });

    test("Email is already in database (verified)", async () => {
      mockCookies.set("sessionId", "1234567890");

      await createEmailVerificationCode({
        emailConfirmed: true,
      });

      const response = await $api.sendEmailVerification();

      expect(response.message).toEqual(
        "Email owen@test.gov has already been verified",
      );
      expect(response.status).toEqual("ALREADY_VERIFIED");

      expect(mockEmails.send).not.toBeCalled();
      expect(mockEmails.generateSixDigitCode).not.toBeCalled();
    });
  });

  describe("email-verification/confirmEmail", () => {
    test("Email already verified", async () => {
      mockCookies.set("sessionId", "1234567890");

      await createEmailVerificationCode({
        emailConfirmed: true,
      });

      const response = await $api.confirmEmail({
        code: "019821",
      });

      expect(response.status).toBe("SUCCESS");
    });

    test("No email verification code entry", () => {
      mockCookies.set("sessionId", "1234567890");

      expect(
        $api.confirmEmail({
          code: "123456",
        }),
      ).rejects.toThrow("owen@test.gov is not verified.");
    });

    test("Given code is incorrect", async () => {
      mockCookies.set("sessionId", "1234567890");

      await createEmailVerificationCode({
        emailConfirmed: false,
      });

      expect(
        $api.confirmEmail({
          code: "123456",
        }),
      ).rejects.toThrow("owen@test.gov is not verified.");
    });

    test("Given code is expired", async () => {
      mockCookies.set("sessionId", "1234567890");

      await createEmailVerificationCode({
        emailConfirmed: false,
      });
      const expiredDate = new Date(Date.now() + 60_000 * -15);

      await prisma.emailVerificationCode.update({
        where: {
          email: "owen@test.gov",
        },
        data: {
          expiresAt: expiredDate,
        },
      });

      mockEmails.generateSixDigitCode.mockImplementationOnce(() => {
        return "987654";
      });

      const response = await $api.confirmEmail({
        code: "019821",
      });

      const emailVerificationCode =
        await prisma.emailVerificationCode.findUnique({
          where: {
            email: "owen@test.gov",
          },
        });

      expect(mockEmails.send).toBeCalled();
      expect(mockEmails.generateSixDigitCode).toBeCalled();

      expect(emailVerificationCode?.email).toEqual("owen@test.gov");
      expect(emailVerificationCode?.code).toEqual("987654");
      expect(emailVerificationCode?.emailConfirmed).toEqual(false);
      expect(emailVerificationCode?.expiresAt).not.toEqual(expiredDate);

      expect(response.status).toEqual("RESENT");
    });

    test("Given code is valid", async () => {
      mockCookies.set("sessionId", "1234567890");

      await createEmailVerificationCode({
        emailConfirmed: false,
      });

      const response = await $api.confirmEmail({
        code: "019821",
      });

      const emailVerificationCode =
        await prisma.emailVerificationCode.findUnique({
          where: {
            email: "owen@test.gov",
          },
        });

      expect(emailVerificationCode?.emailConfirmed).toBe(true);

      expect(response.message).toEqual(
        "Email was successfully verified. Email: owen@test.gov.",
      );
    });
  });
});
