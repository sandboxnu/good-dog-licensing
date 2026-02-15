import {
  afterEach,
  beforeEach,
  setSystemTime,
  describe,
  expect,
  test,
} from "bun:test";

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

  const oneMonthAfter = new Date("2025-03-13T12:00:00Z");
  const twelveHoursAfter = new Date("2025-02-12T00:00:00Z");

  beforeEach(() => {
    setSystemTime(new Date("2025-02-11T12:00:00Z"));
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
    setSystemTime(); // reset time to normal
  });

  describe("with existing account", () => {
    test("auth/signIn with rememeber_me", async () => {
      await createAccount();

      const signInResponse = await $api.signIn({
        email: "damian@gmail.com",
        password: "password123",
        rememberMe: true,
      });

      expect(signInResponse.message).toEqual(
        "Successfully logged in as damian@gmail.com",
      );
      expect(mockCookies.set).toBeCalledWith("sessionId", expect.any(String), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        expires: oneMonthAfter,
      });
    });

    test("auth/signIn without rememeber_me", async () => {
      await createAccount();

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
        expires: twelveHoursAfter,
      });
    });

    test("auth/signIn failure", async () => {
      await createAccount();

      expect(
        $api.signIn({
          email: "damian@gmail.com",
          password: "thisIsTheWrongPassword",
        }),
      ).rejects.toThrow("Invalid credentials");

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

  test("auth/deactivateSelf", async () => {
    const session = await createSession();
    mockCookies.set("sessionId", session.sessionId);

    const deactiveSelfResponse = await $api.deactivateSelf();

    expect(deactiveSelfResponse.message).toEqual(
      "Successfully deactivated account",
    );
  });
});
