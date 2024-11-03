import { afterEach, beforeAll, describe, expect, test } from "bun:test";

import { hashPassword } from "@good-dog/auth/password";
import { prisma } from "@good-dog/db";
import { $trpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";
import { MockSendGridEmails } from "../mocks/MockSendGridEmails";

describe("auth", () => {
  const mockCookies = new MockNextCookies();
  const mockEmails = new MockSendGridEmails();

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
    prisma.user.upsert({
      create: {
        id: "testId124389124",
        name: "Damian",
        email: "damian@gmail.com",
        hashedPassword: await hashPassword("password123"),
      },
      update: {
        id: "testId124389124",
        email: "damian@gmail.com",
        hashedPassword: await hashPassword("password123"),
      },
      where: {
        email: "damian@gmail.com",
      },
    });

  const createSession = async () =>
    prisma.session.create({
      data: {
        expiresAt: new Date("2099-01-01"),
        user: {
          connectOrCreate: {
            create: {
              id: "testId124389124",
              name: "Damian",
              email: "damian@gmail.com",
              hashedPassword: await hashPassword("password123"),
            },
            where: {
              id: "testId124389124",
            },
          },
        },
      },
    });

  const cleanupAccount = async () => {
    try {
      await prisma.user.delete({
        where: {
          email: "damian@gmail.com",
        },
      });
    } catch (ignored) {}
  };

  const cleanupEmailVerificationCode = async () => {
    try {
      await prisma.emailVerificationCode.delete({
        where: {
          email: "damian@gmail.com",
        },
      });
    } catch (ignored) {}
  };

  beforeAll(async () => {
    await mockCookies.apply();
    await mockEmails.apply();
  });

  afterEach(() => {
    mockCookies.clear();
  });

  describe("auth/sendEmailVerification", () => {
    test("Email is not in database", async () => {
      await cleanupEmailVerificationCode();

      const response = await $trpcCaller.sendEmailVerification({
        email: "damian@gmail.com",
      });

      const emailVerificationCode =
        await prisma.emailVerificationCode.findUnique({
          where: {
            email: "damian@gmail.com",
          },
        });

      expect(emailVerificationCode?.email).toEqual("damian@gmail.com");
      expect(emailVerificationCode?.code.length).toEqual(6);
      expect(emailVerificationCode?.emailConfirmed).toEqual(false);

      expect(response.message).toEqual(
        "Email verification code sent to damian@gmail.com",
      );

      await cleanupEmailVerificationCode();
    });

    test("Email is already in database (not verified)", async () => {
      await createEmailVerificationCode(false);

      const response = await $trpcCaller.sendEmailVerification({
        email: "damian@gmail.com",
      });

      const emailVerificationCode =
        await prisma.emailVerificationCode.findUnique({
          where: {
            email: "damian@gmail.com",
          },
        });

      expect(emailVerificationCode?.email).toEqual("damian@gmail.com");
      expect(emailVerificationCode?.code.length).toEqual(6);
      expect(emailVerificationCode?.code).not.toEqual("019821");
      expect(emailVerificationCode?.emailConfirmed).toEqual(false);

      expect(response.message).toEqual(
        "Email verification code sent to damian@gmail.com",
      );

      await cleanupEmailVerificationCode();
    });

    test("Email is already in database (verified)", async () => {
      await createEmailVerificationCode(true);

      const sendEmailVerification = async () =>
        $trpcCaller.sendEmailVerification({
          email: "damian@gmail.com",
        });

      expect(sendEmailVerification).toThrow("Email already verified");

      await cleanupEmailVerificationCode();
    });
  });

  describe("auth/confirmEmail", () => {
    test("Email already verified", async () => {
      await createEmailVerificationCode(true);

      const response = await $trpcCaller.confirmEmail({
        email: "damian@gmail.com",
        code: "019821",
      });

      expect(response.message).toEqual(
        "Email was successfully verified. Email: damian@gmail.com.",
      );

      await cleanupEmailVerificationCode();
    });

    test("No email verification code entry", async () => {
      await cleanupEmailVerificationCode();

      const confirmEmail = async () =>
        $trpcCaller.confirmEmail({
          email: "damian@gmail.com",
          code: "123456",
        });

      expect(confirmEmail).toThrow(
        "damian@gmail.com is not waiting to be confirmed.",
      );
    });

    test("Given code is incorrect", async () => {
      await createEmailVerificationCode(false);

      const confirmEmail = async () =>
        $trpcCaller.confirmEmail({
          email: "damian@gmail.com",
          code: "123456",
        });

      expect(confirmEmail).toThrow(
        "Given code is incorrect for damian@gmail.com",
      );

      await cleanupEmailVerificationCode();
    });

    test("Given code is expired", async () => {
      await createEmailVerificationCode(false);

      await prisma.emailVerificationCode.update({
        where: {
          email: "damian@gmail.com",
        },
        data: {
          expiresAt: new Date(Date.now() + 60_000 * -15),
        },
      });

      const confirmEmail = async () =>
        $trpcCaller.confirmEmail({
          email: "damian@gmail.com",
          code: "019821",
        });

      expect(confirmEmail).toThrow("Given code is expired.");

      await cleanupEmailVerificationCode();
    });

    test("Given code is valid", async () => {
      await createEmailVerificationCode(false);

      const response = await $trpcCaller.confirmEmail({
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

  describe("auth/signUp", () => {
    test("Email is verified", async () => {
      await createEmailVerificationCode(true);
      await cleanupAccount();

      const response = await $trpcCaller.signUp({
        name: "Damian",
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

      await cleanupAccount();
      await cleanupEmailVerificationCode();
    });

    test("Email is not verified (awaiting)", async () => {
      await createEmailVerificationCode(false);
      await cleanupAccount();

      const createAccountHelp = async () =>
        await $trpcCaller.signUp({
          name: "Damian",
          email: "damian@gmail.com",
          password: "password123",
        });

      expect(createAccountHelp).toThrow("Email has not been verified.");

      await cleanupEmailVerificationCode();
    });

    test("Email is not verified (not awaiting)", async () => {
      await cleanupEmailVerificationCode();
      await cleanupAccount();

      const createAccountHelp = async () =>
        await $trpcCaller.signUp({
          name: "Damian",
          email: "damian@gmail.com",
          password: "password123",
        });

      expect(createAccountHelp).toThrow("Email has not been verified.");

      await cleanupEmailVerificationCode();
    });
  });

  describe("with existing account", () => {
    test("auth/signIn", async () => {
      await createEmailVerificationCode(true);
      await createAccount();

      const signInResponse = await $trpcCaller.signIn({
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

      await cleanupEmailVerificationCode();
      await cleanupAccount();
    });

    test("auth/signIn failure", async () => {
      await createEmailVerificationCode(true);
      await createAccount();

      expect(
        $trpcCaller.signIn({
          email: "damian@gmail.com",
          password: "thisIsTheWrongPassword",
        }),
      ).rejects.toThrow("Invalid credentials");

      expect(mockCookies.set).not.toBeCalled();

      await cleanupEmailVerificationCode();
      await cleanupAccount();
    });

    test("auth/signUp failure", async () => {
      await createEmailVerificationCode(true);
      await createAccount();

      const createAccountHelp = async () =>
        await $trpcCaller.signUp({
          name: "Damian",
          email: "damian@gmail.com",
          password: "password123",
        });

      expect(createAccountHelp).toThrow(
        "User already exists with email damian@gmail.com",
      );
      expect(mockCookies.set).not.toBeCalled();

      await cleanupEmailVerificationCode();
      await cleanupAccount();
    });
  });

  test("auth/signOut", async () => {
    const session = await createSession();
    mockCookies.set("sessionId", session.id);

    const res = await $trpcCaller.signOut();

    expect(mockCookies.delete).toBeCalledWith("sessionId");
    expect(res.message).toEqual("Successfully logged out");

    await cleanupAccount();
  });

  test("auth/deleteAccount", async () => {
    const session = await createSession();
    mockCookies.set("sessionId", session.id);

    const deleteAccountResponse = await $trpcCaller.deleteAccount();

    expect(deleteAccountResponse.message).toEqual(
      "Successfully deleted account",
    );
    expect(mockCookies.delete).toBeCalledWith("sessionId");
  });
});
