import { afterAll, afterEach, beforeAll, describe, expect, it } from "bun:test";
import { ZodError } from "zod";

import { passwordService } from "@good-dog/auth/password";
import { prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

describe("error formatting", () => {
  const cookies = new MockNextCookies();

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(cookies),
  });

  it("should format error with cause", () => {
    expect(
      $api.signIn({
        email: "not-an-email",
        password: "grrrr",
      }),
    ).rejects.toMatchObject({
      code: "BAD_REQUEST",
      cause: expect.any(ZodError),
    });
  });
});

describe("middleware", () => {
  const cookies = new MockNextCookies();

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(cookies),
    prisma: prisma,
    passwordService: passwordService,
  });

  beforeAll(async () => {
    await prisma.user.create({
      data: {
        userId: "middleware-test-user",
        email: "test@testing.com",
        phoneNumber: "1234567890",
        firstName: "test",
        lastName: "user",
        role: "MEDIA_MAKER",
        hashedPassword: await passwordService.hashPassword("passwordABC"),
        sessions: {
          createMany: {
            data: [
              {
                sessionId: "middleware-test-session",
                expiresAt: new Date(Date.now() + 200_000),
              },
              {
                sessionId: "middleware-test-session-expired",
                expiresAt: new Date(Date.now() - 200_000),
              },
            ],
          },
        },
      },
      select: {
        userId: true,
        sessions: true,
      },
    });
  });

  afterEach(() => {
    cookies.clear();
  });

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        userId: "middleware-test-user",
      },
    });
  });

  describe("authenticatedProcedure", () => {
    it("should reject with no session id", () => {
      expect($api.signOut()).rejects.toMatchObject({
        code: "UNAUTHORIZED",
      });
    });

    it("should reject bad session id", () => {
      cookies.set("sessionId", "XXX");
      expect($api.signOut()).rejects.toMatchObject({
        code: "UNAUTHORIZED",
      });
    });

    it("should accept valid session id", () => {
      cookies.set("sessionId", "middleware-test-session");
      expect($api.signOut()).resolves.toBeTruthy();
    });

    it("should reject expired session id", () => {
      cookies.set("sessionId", "middleware-test-session-expired");
      expect($api.signOut()).rejects.toMatchObject({
        code: "UNAUTHORIZED",
      });
    });
  });

  describe("notAuthenticatedProcedure", () => {
    it("should accept no session id", () => {
      expect(
        $api.signIn({
          email: "test@testing.com",
          password: "passwordABC",
        }),
      ).resolves.toBeTruthy();
    });

    it("should reject with valid session id", () => {
      cookies.set("sessionId", "middleware-test-session");
      expect(
        $api.signIn({
          email: "test@testing.com",
          password: "passwordABC",
        }),
      ).rejects.toMatchObject({ code: "FORBIDDEN" });
    });

    it("should accept expired session id", () => {
      cookies.set("sessionId", "middleware-test-session-expired");
      expect(
        $api.signIn({
          email: "test@testing.com",
          password: "passwordABC",
        }),
      ).resolves.toBeTruthy();
    });

    it("should accept bad session id", () => {
      cookies.set("sessionId", "XXX");
      expect(
        $api.signIn({
          email: "test@testing.com",
          password: "passwordABC",
        }),
      ).resolves.toBeTruthy();
    });
  });
});
