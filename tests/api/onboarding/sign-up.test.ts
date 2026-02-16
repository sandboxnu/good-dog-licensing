import { afterEach, describe, expect, test } from "bun:test";

import { passwordService } from "@good-dog/auth/password";
import { prisma, Role } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockEmailService } from "../../mocks/MockEmailService";
import { MockNextCookies } from "../../mocks/MockNextCookies";
import { createMockCookieService } from "../../mocks/util";

describe("sign-up", () => {
  const mockEmails = new MockEmailService();
  const mockCookies = new MockNextCookies();

  const $api = $createTrpcCaller({
    emailService: mockEmails,
    cookiesService: createMockCookieService(mockCookies),
    prisma: prisma,
    passwordService: passwordService,
  });

  const signUpInput = {
    firstName: "Jordan",
    lastName: "Smith",
    role: Role.MUSICIAN,
    email: "jordan@example.com",
    phoneNumber: "1234567890",
    password: "Mypassword1!",
    confirmPassword: "Mypassword1!",
    emailCode: "019821",
    termsOfService: true as true,
    howHeardAboutUs: [] as (
      | "friend_colleague"
      | "green_line_records"
      | "social_media"
      | "other"
    )[],
  };

  afterEach(async () => {
    mockCookies.clear();
    mockEmails.clear();

    await prisma.$transaction([
      prisma.user.deleteMany({
        where: {
          email: "jordan@example.com",
        },
      }),
      prisma.emailVerificationCode.deleteMany({
        where: {
          email: "jordan@example.com",
        },
      }),
    ]);
  });

  const createEmailVerificationCode = async (past: boolean) => {
    await prisma.emailVerificationCode.create({
      data: {
        email: "jordan@example.com",
        code: "123123",
        expiresAt: past
          ? new Date(Date.now() - 1000)
          : new Date(Date.now() + 60000),
      },
    });
  };

  test("Fails when email already exists", async () => {
    await prisma.user.create({
      data: {
        firstName: "Jordan",
        lastName: "Smith",
        hashedPassword: "haksjdhaskd",
        role: "MUSICIAN",
        email: "jordan@example.com",
        phoneNumber: "1234567890",
      },
    });

    expect($api.signUp(signUpInput)).rejects.toThrow(
      "User already exists with email jordan@example.com",
    );
  });

  test("Resends code when expired", async () => {
    await createEmailVerificationCode(true);

    const result = await $api.signUp(signUpInput);

    const emailVerificationCode = await prisma.emailVerificationCode.findUnique(
      {
        where: {
          email: "jordan@example.com",
        },
      },
    );

    expect(result.status).toBe("RESENT");
    expect(mockEmails.send).toBeCalled();
    expect(mockEmails.generateSixDigitCode).toBeCalled();

    expect(emailVerificationCode?.code).toBe("123456");
    expect(emailVerificationCode?.expiresAt).toBeInstanceOf(Date);
  });

  test("Fails when email code is incorrect", async () => {
    await createEmailVerificationCode(false);

    expect($api.signUp(signUpInput)).rejects.toThrow(
      "Email jordan@example.com has not been verified",
    );

    expect(mockEmails.send).not.toBeCalled();
    expect(mockEmails.generateSixDigitCode).not.toBeCalled();
  });

  test("User should be created when all info is correct", async () => {
    await createEmailVerificationCode(false);

    const result = await $api.signUp({
      ...signUpInput,
      emailCode: "123123",
    });

    const user = await prisma.user.findUnique({
      where: {
        email: "jordan@example.com",
      },
      include: {
        sessions: true,
      },
    });

    expect(result.message).toBe(
      "Successfully signed up and logged in as jordan@example.com.",
    );
    expect(user?.email).toBe("jordan@example.com");
    expect(user?.sessions[0]).toBeDefined();
    expect(user?.firstName).toBe("Jordan");
    expect(user?.lastName).toBe("Smith");
    expect(user?.role).toBe("MUSICIAN");
    expect(user?.phoneNumber).toBe("1234567890");
    expect(user?.hashedPassword).not.toBe("Password");

    expect(mockEmails.send).not.toBeCalled();
    expect(mockEmails.generateSixDigitCode).not.toBeCalled();
  });
});
