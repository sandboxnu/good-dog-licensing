import { afterEach, describe, expect, test } from "bun:test";

import { passwordService } from "@good-dog/auth/password";
import { prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

describe("auth", () => {
  const mockCookies = new MockNextCookies();

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(mockCookies),
    prisma: prisma,
    passwordService: passwordService,
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

  const createAccount = async () =>
    prisma.user.create({
      data: {
        firstName: "Damian",
        lastName: "Smith",
        role: "MEDIA_MAKER",
        phoneNumber: "1234567890",
        email: "damian@gmail.com",
        hashedPassword: await passwordService.hashPassword("password123"),
      },
    });

  const createSession = async () =>
    prisma.session.create({
      data: {
        expiresAt: new Date("2099-01-01"),
        user: {
          connectOrCreate: {
            create: {
              firstName: "Damian",
              lastName: "Smith",
              role: "MEDIA_MAKER",
              phoneNumber: "2345678901",
              email: "damian@gmail.com",
              hashedPassword: await passwordService.hashPassword("password123"),
            },
            where: {
              email: "damian@gmail.com",
            },
          },
        },
      },
    });

  afterEach(async () => {
    await Promise.all([
      prisma.user.deleteMany({
        where: {
          email: "damian@gmail.com",
        },
      }),
      prisma.emailVerificationCode.deleteMany({
        where: {
          email: "damian@gmail.com",
        },
      }),
    ]);
  });

  afterEach(() => {
    mockCookies.clear();
  });

  describe("auth/signUp", () => {
    test("Email is verified", async () => {
      await createEmailVerificationCode(true);

      const response = await $api.signUp({
        firstName: "Damian",
        lastName: "Smith",
        phoneNumber: "1234567890",
        email: "damian@gmail.com",
        password: "password123",
      });

      expect(response.message).toEqual(
        "Successfully signed up and logged in as damian@gmail.com.",
      );

      expect(mockCookies.set).toBeCalledWith("sessionId", expect.any(String), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        expires: expect.any(Date),
      });
    });

    test("Email is not verified (awaiting)", async () => {
      await createEmailVerificationCode(false);

      const createAccountHelp = async () =>
        await $api.signUp({
          firstName: "Damian",
          lastName: "Smith",
          phoneNumber: "1234567890",
          email: "damian@gmail.com",
          password: "password123",
        });

      expect(createAccountHelp).toThrow("Email has not been verified.");
    });

    test("Email is not verified (not awaiting)", () => {
      const createAccountHelp = async () =>
        await $api.signUp({
          firstName: "Damian",
          lastName: "Smith",
          phoneNumber: "1234567890",
          email: "damian@gmail.com",
          password: "password123",
        });

      expect(createAccountHelp).toThrow("Email has not been verified.");
    });
  });

  describe("with existing account", () => {
    test("auth/signIn", async () => {
      await Promise.all([createEmailVerificationCode(true), createAccount()]);

      const signInResponse = await $api.signIn({
        email: "damian@gmail.com",
        password: "password123",
      });

      expect(signInResponse.message).toEqual(
        "Successfully logged in as damian@gmail.com",
      );
      expect(mockCookies.set).toBeCalledWith("sessionId", expect.any(String), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        expires: expect.any(Date),
      });
    });

    test("auth/signIn failure", async () => {
      await Promise.all([createEmailVerificationCode(true), createAccount()]);

      expect(
        $api.signIn({
          email: "damian@gmail.com",
          password: "thisIsTheWrongPassword",
        }),
      ).rejects.toThrow("Invalid credentials");

      expect(mockCookies.set).not.toBeCalled();
    });

    test("auth/signUp failure", async () => {
      await Promise.all([createEmailVerificationCode(true), createAccount()]);

      expect(
        $api.signUp({
          firstName: "Damian",
          lastName: "Smith",
          phoneNumber: "1234567890",
          email: "damian@gmail.com",
          password: "password123",
        }),
      ).rejects.toThrow("User already exists with email damian@gmail.com");
      expect(mockCookies.set).not.toBeCalled();
    });
  });

  test("auth/signOut", async () => {
    const session = await createSession();
    mockCookies.set("sessionId", session.sessionId);

    const res = await $api.signOut();

    expect(mockCookies.delete).toBeCalledWith("sessionId");
    expect(res.message).toEqual("Successfully logged out");
  });

  test("auth/deleteAccount", async () => {
    const session = await createSession();
    mockCookies.set("sessionId", session.sessionId);

    const deleteAccountResponse = await $api.deleteAccount();

    expect(deleteAccountResponse.message).toEqual(
      "Successfully deleted account",
    );
    expect(mockCookies.delete).toBeCalledWith("sessionId");
  });

  test("auth/refreshSession", async () => {
    const session = await createSession();
    mockCookies.set("sessionId", session.sessionId);
    mockCookies.set.mockRestore();

    const refreshSessionResponse = await $api.refreshSession();

    expect(refreshSessionResponse.message).toEqual("Session refreshed");

    expect(mockCookies.set).toBeCalledWith("sessionId", session.sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: expect.any(Date),
    });
  });
});
