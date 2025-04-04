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

  const createEmailVerificationCode = async ({
    emailConfirmed,
  }: {
    emailConfirmed: boolean;
  }) =>
    prisma.emailVerificationCode.create({
      data: {
        email: "damian@gmail.com",
        code: "019821",
        expiresAt: new Date(Date.now() + 60_000 * 100000),
        emailConfirmed: emailConfirmed,
      },
    });

  afterEach(async () => {
    mockCookies.clear();
    mockEmails.clear();

    // delete many used to prevent error if email verification code does not exist
    await prisma.emailVerificationCode.deleteMany({
      where: {
        email: "damian@gmail.com",
      },
    });
  });

  describe("email-verification/sendEmailVerification", () => {
    test("Email is not in database", async () => {
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
    });

    test("Email sending error", () => {
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
    });

    test("Email is already in database (not verified)", async () => {
      await createEmailVerificationCode({ emailConfirmed: false });

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
    });

    test("Email is already in database (verified)", async () => {
      await createEmailVerificationCode({
        emailConfirmed: true,
      });

      const response = await $api.sendEmailVerification({
        email: "damian@gmail.com",
      });

      expect(response.message).toEqual(
        "Email damian@gmail.com has already been verified",
      );
      expect(response.status).toEqual("ALREADY_VERIFIED");

      expect(mockEmails.send).not.toBeCalled();
      expect(mockEmails.generateSixDigitCode).not.toBeCalled();
    });
  });

  describe("email-verification/confirmEmail", () => {
    test("Email already verified", async () => {
      await createEmailVerificationCode({
        emailConfirmed: true,
      });

      const response = await $api.confirmEmail({
        email: "damian@gmail.com",
        code: "019821",
      });

      expect(response.status).toBe("SUCCESS");
    });

    test("No email verification code entry", () => {
      expect(
        $api.confirmEmail({
          email: "damian@gmail.com",
          code: "123456",
        }),
      ).rejects.toThrow("damian@gmail.com is not verified.");
    });

    test("Given code is incorrect", async () => {
      await createEmailVerificationCode({
        emailConfirmed: false,
      });

      expect(
        $api.confirmEmail({
          email: "damian@gmail.com",
          code: "123456",
        }),
      ).rejects.toThrow("damian@gmail.com is not verified.");
    });

    test("Given code is expired", async () => {
      await createEmailVerificationCode({
        emailConfirmed: false,
      });
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
    });

    test("Given code is valid", async () => {
      await createEmailVerificationCode({
        emailConfirmed: false,
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

      expect(emailVerificationCode?.emailConfirmed).toBe(true);

      expect(response.message).toEqual(
        "Email was successfully verified. Email: damian@gmail.com.",
      );
    });
  });
});
