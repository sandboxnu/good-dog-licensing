import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { hashPassword } from "@good-dog/auth/password";
import { prisma } from "@good-dog/db";
import { $trpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";

describe("auth", () => {
  const mockCookies = new MockNextCookies();

  const createAccount = async () =>
    prisma.user.create({
      data: {
        name: "Damian",
        email: "damian@gmail.com",
        hashedPassword: await hashPassword("password123"),
      },
    });
  const createSession = async () =>
    prisma.session.create({
      data: {
        expiresAt: new Date("2099-01-01"),
        user: {
          create: {
            name: "Damian",
            email: "damian@gmail.com",
            hashedPassword: await hashPassword("password123"),
          },
        },
      },
    });

  const cleanupAccount = async () => {
    const sessionId = mockCookies.get("sessionId")?.value;

    if (!sessionId) {
      throw new Error("sessionId not found in cookies");
    }

    const session = await prisma.session.findUniqueOrThrow({
      where: {
        id: sessionId,
      },
    });

    await prisma.user.delete({
      where: {
        id: session.userId,
      },
    });
  };

  beforeEach(async () => {
    await mockCookies.apply();
  });

  describe("with account deletion", () => {
    afterEach(async () => {
      await cleanupAccount();
    });

    test("auth/signUp", async () => {
      const response = await $trpcCaller.signUp({
        name: "Damian",
        email: "damian@gmail.com",
        password: "password123",
      });

      expect(response.message).toEqual(
        "Successfully signed up and logged in as damian@gmail.com",
      );
      expect(mockCookies.set).toBeCalledWith("sessionId", expect.any(String));
    });

    test("auth/signIn", async () => {
      await createAccount();

      const signInResponse = await $trpcCaller.signIn({
        email: "damian@gmail.com",
        password: "password123",
      });

      expect(signInResponse.message).toEqual(
        "Successfully logged in as damian@gmail.com",
      );
      expect(mockCookies.set).toBeCalledWith("sessionId", expect.any(String));
    });

    test("auth/signIn failure", async () => {
      await createAccount();

      expect(
        $trpcCaller.signIn({
          email: "damian@gmail.com",
          password: "thisIsTheWrongPassword",
        }),
      ).rejects.toThrow("Invalid credentials");

      expect(mockCookies.set).not.toBeCalled();
    });

    test("auth/signOut", async () => {
      const session = await createSession();
      mockCookies.set("sessionId", session.id);

      const res = await $trpcCaller.signOut();

      expect(mockCookies.delete).toBeCalledWith("sessionId");
      expect(res.message).toEqual("Successfully logged out");

      // Reset the cookies to prepare for deletion
      mockCookies.set("sessionId", session.id);
    });

    test("auth/signUp failure", async () => {
      await createAccount();

      expect(
        $trpcCaller.signUp({
          name: "Damian",
          email: "damian@gmail.com",
          password: "password",
        }),
      ).rejects.toThrow("User already exists for damian@gmail.com");
      expect(mockCookies.set).not.toBeCalled();
    });
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
