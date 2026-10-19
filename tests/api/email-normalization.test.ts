import { afterEach, describe, expect, test } from "bun:test";

import { passwordService } from "@good-dog/auth/password";
import { prisma, Role } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockEmailService } from "../mocks/MockEmailService";
import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

// Emails are typed with capitals and surrounding spaces, as a phone keyboard
// might produce, and must be treated the same as their lowercase form.
const TYPED_EMAIL = "  Normalize.Test@Example.com ";
const NORMALIZED_EMAIL = "normalize.test@example.com";
const ADMIN_EMAIL = "normalize.admin@example.com";

describe("email normalization", () => {
  const mockEmails = new MockEmailService();
  const mockCookies = new MockNextCookies();

  const $api = $createTrpcCaller({
    emailService: mockEmails,
    cookiesService: createMockCookieService(mockCookies),
    prisma: prisma,
    passwordService: passwordService,
  });

  const signUpValues = {
    firstName: "Jordan",
    lastName: "Smith",
    role: Role.MUSICIAN,
    phoneNumber: "1234567890",
    password: "Mypassword1!",
    confirmPassword: "Mypassword1!",
    termsOfService: true as const,
    howHeardAboutUs: ["FRIEND" as const],
  };

  const createUser = (email: string, role: Role = Role.MUSICIAN) =>
    prisma.user.create({
      data: {
        firstName: "Jordan",
        lastName: "Smith",
        role,
        email,
        phoneNumber: "1234567890",
        hashedPassword: "xxxx",
      },
    });

  afterEach(async () => {
    mockCookies.clear();
    mockEmails.clear();
    await prisma.$transaction([
      prisma.passwordResetReq.deleteMany({
        where: { user: { email: NORMALIZED_EMAIL } },
      }),
      prisma.user.deleteMany({
        where: { email: { in: [NORMALIZED_EMAIL, ADMIN_EMAIL] } },
      }),
      prisma.emailVerificationCode.deleteMany({
        where: { email: NORMALIZED_EMAIL },
      }),
      prisma.moderatorInvite.deleteMany({
        where: { email: NORMALIZED_EMAIL },
      }),
    ]);
  });

  test("sendEmailVerification stores the code under the normalized email", async () => {
    const response = await $api.sendEmailVerification({ email: TYPED_EMAIL });

    expect(response.email).toBe(NORMALIZED_EMAIL);
    const code = await prisma.emailVerificationCode.findUnique({
      where: { email: NORMALIZED_EMAIL },
    });
    expect(code?.code).toBe("123456");
  });

  test("sendEmailVerification rejects an existing user regardless of case", async () => {
    await createUser(NORMALIZED_EMAIL);

    expect($api.sendEmailVerification({ email: TYPED_EMAIL })).rejects.toThrow(
      `User already exists with email ${NORMALIZED_EMAIL}`,
    );
  });

  test("verifyEmailCode accepts a code sent to a differently-cased email", async () => {
    await $api.sendEmailVerification({ email: NORMALIZED_EMAIL });

    const response = await $api.verifyEmailCode({
      email: TYPED_EMAIL,
      emailCode: "123456",
    });

    expect(response.status).toBe("VALID");
  });

  test("full sign up succeeds with a capitalized email", async () => {
    await $api.sendEmailVerification({ email: TYPED_EMAIL });
    await $api.verifyEmailCode({ email: TYPED_EMAIL, emailCode: "123456" });

    const response = await $api.signUp({
      ...signUpValues,
      email: TYPED_EMAIL,
      emailCode: "123456",
    });

    expect(response.message).toBe(
      `Successfully signed up and logged in as ${NORMALIZED_EMAIL}.`,
    );
    const user = await prisma.user.findUnique({
      where: { email: NORMALIZED_EMAIL },
    });
    expect(user).not.toBeNull();
  });

  test("sendForgotPasswordEmail finds the account regardless of case", async () => {
    await createUser(NORMALIZED_EMAIL);

    await $api.sendForgotPasswordEmail({ email: TYPED_EMAIL });

    expect(mockEmails.send).toBeCalled();
    const resetRequests = await prisma.passwordResetReq.findMany({
      where: { user: { email: NORMALIZED_EMAIL } },
    });
    expect(resetRequests.length).toBe(1);
  });

  test("sendModeratorInviteEmail stores the invite under the normalized email", async () => {
    await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "User",
        role: Role.ADMIN,
        email: ADMIN_EMAIL,
        phoneNumber: "1234567890",
        hashedPassword: "xxxx",
        sessions: {
          create: {
            sessionId: "normalize-admin-session-id",
            expiresAt: new Date(Date.now() + 5_000_000_000),
          },
        },
      },
    });
    mockCookies.set("sessionId", "normalize-admin-session-id");

    const response = await $api.sendModeratorInviteEmail({
      moderatorEmail: TYPED_EMAIL,
    });

    expect(response.message).toBe(
      `Moderator Invite sent to ${NORMALIZED_EMAIL}`,
    );
    const invite = await prisma.moderatorInvite.findUnique({
      where: { email: NORMALIZED_EMAIL },
    });
    expect(invite).not.toBeNull();
  });
});
