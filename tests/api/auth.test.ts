import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "bun:test";

import { hashPassword } from "@good-dog/auth/password";
import { prisma } from "@good-dog/db";
import { $trpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";

describe("auth", () => {
  const mockCookies = new MockNextCookies();

  const createAccount = async () =>
    prisma.user.upsert({
      create: {
        id: "testId124389124",
        firstName: "Damian",
        lastName: "Smith",
        role: "MEDIA_MAKER",
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
              firstName: "Damian",
              lastName: "Smith",
              role: "MEDIA_MAKER",
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
    await prisma.user.delete({
      where: {
        email: "damian@gmail.com",
      },
    });
  };

  beforeAll(async () => {
    await mockCookies.apply();
  });

  afterEach(() => {
    mockCookies.clear();
  });

  test("auth/signUp", async () => {
    const response = await $trpcCaller.signUp({
      firstName: "Damian",
      lastName: "Smith",
      role: "MEDIA_MAKER",
      email: "damian@gmail.com",
      password: "password123",
    });

    expect(response.message).toEqual(
      "Successfully signed up and logged in as damian@gmail.com",
    );

    expect(mockCookies.set).toBeCalledWith("sessionId", expect.any(String), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: expect.any(Date),
    });

    await cleanupAccount();
  });

  describe("with existing account", () => {
    beforeAll(async () => {
      await createAccount();
    });
    afterAll(async () => {
      await cleanupAccount();
    });

    test("auth/signIn", async () => {
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
    });

    test("auth/signIn failure", () => {
      expect(
        $trpcCaller.signIn({
          email: "damian@gmail.com",
          password: "thisIsTheWrongPassword",
        }),
      ).rejects.toThrow("Invalid credentials");

      expect(mockCookies.set).not.toBeCalled();
    });

    test("auth/signUp failure", () => {
      expect(
        $trpcCaller.signUp({
          firstName: "Damian",
          lastName: "Smith",
          role: "MEDIA_MAKER",
          email: "damian@gmail.com",
          password: "password",
        }),
      ).rejects.toThrow("User already exists with email damian@gmail.com");
      expect(mockCookies.set).not.toBeCalled();
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
