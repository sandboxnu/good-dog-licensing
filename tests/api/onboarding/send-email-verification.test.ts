import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "bun:test";

import { prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockEmailService } from "../../mocks/MockEmailService";
import { MockNextCookies } from "../../mocks/MockNextCookies";
import { createMockCookieService } from "../../mocks/util";

describe("email-verification", () => {
  const mockEmails = new MockEmailService();
  const mockCookies = new MockNextCookies();

  const $api = $createTrpcCaller({
    emailService: mockEmails,
    cookiesService: createMockCookieService(mockCookies),
    prisma: prisma,
  });

  const createEmailVerificationCode = async () =>
    prisma.emailVerificationCode.create({
      data: {
        email: "owen@test.gov",
        code: "019821",
        expiresAt: new Date(Date.now() + 60_000 * 100000),
      },
    });

  beforeAll(async () => {
    await prisma.user.create({
      data: {
        firstName: "Owen",
        lastName: "Smith",
        hashedPassword: "fiadsfjasif",
        role: "MEDIA_MAKER",
        email: "owen2@test.gov",
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

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: "owen2@test.gov",
      },
    });
  });

  afterEach(async () => {
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
      const response = await $api.sendEmailVerification({
        email: "owen@test.gov",
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
      expect(emailVerificationCode?.code).toEqual("123456");
      expect(emailVerificationCode?.expiresAt).toBeInstanceOf(Date);

      expect(response.message).toEqual(
        "Email verification code sent to owen@test.gov",
      );
    });

    test("Email sending error", () => {
      mockEmails.send.mockImplementationOnce(() => {
        throw new Error("Mock email failure.");
      });

      expect(
        $api.sendEmailVerification({ email: "owen@test.gov" }),
      ).rejects.toThrow("Email confirmation to owen@test.gov failed to send.");

      expect(mockEmails.send).toBeCalled();
      expect(mockEmails.generateSixDigitCode).toBeCalled();
    });

    test("Resend email verification code functionality", async () => {
      await createEmailVerificationCode();

      const response = await $api.sendEmailVerification({
        email: "owen@test.gov",
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
      expect(emailVerificationCode?.code).toEqual("123456");
      expect(emailVerificationCode?.expiresAt).toBeInstanceOf(Date);

      expect(response.message).toEqual(
        "Email verification code sent to owen@test.gov",
      );
      expect(response.status).toEqual("EMAIL_SENT");
    });

    test("Email is already a USER", () => {
      expect(
        $api.sendEmailVerification({ email: "owen2@test.gov" }),
      ).rejects.toThrow("User already exists with email owen2@test.gov");

      expect(mockEmails.send).not.toBeCalled();
      expect(mockEmails.generateSixDigitCode).not.toBeCalled();
    });
  });
});
