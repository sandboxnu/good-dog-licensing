import { afterAll, afterEach, beforeAll, describe, expect, it } from "bun:test";
import { ZodError } from "zod";

import { hashPassword } from "@good-dog/auth/password";
import { prisma } from "@good-dog/db";
import { $trpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";

describe("error formatting", () => {
  const cookies = new MockNextCookies();
  beforeAll(async () => {
    await cookies.apply();
  });

  it("should format error with cause", () => {
    expect(
      $trpcCaller.signIn({
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

  beforeAll(async () => {
    await prisma.user.create({
      data: {
        id: "middleware-test-user",
        email: "test@testing.com",
        name: "test user",
        hashedPassword: await hashPassword("passwordABC"),
        sessions: {
          createMany: {
            data: [
              {
                id: "middleware-test-session",
                expiresAt: new Date(Date.now() + 200_000),
              },
              {
                id: "middleware-test-session-expired",
                expiresAt: new Date(Date.now() - 200_000),
              },
            ],
          },
        },
      },
      select: {
        id: true,
        sessions: true,
      },
    });

    await cookies.apply();
  });

  afterEach(() => {
    cookies.clear();
  });

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        id: "middleware-test-user",
      },
    });
  });

  describe("authenticatedProcedure", () => {
    it("should reject with no session id", () => {
      expect($trpcCaller.user()).rejects.toMatchObject({
        code: "UNAUTHORIZED",
      });
    });

    it("should reject bad session id", () => {
      cookies.set("sessionId", "XXX");
      expect($trpcCaller.user()).rejects.toMatchObject({
        code: "UNAUTHORIZED",
      });
    });

    it("should accept valid session id", () => {
      cookies.set("sessionId", "middleware-test-session");
      expect($trpcCaller.user()).resolves.toBeTruthy();
    });

    it("should reject expired session id", () => {
      cookies.set("sessionId", "middleware-test-session-expired");
      expect($trpcCaller.user()).rejects.toMatchObject({
        code: "UNAUTHORIZED",
      });
    });
  });

  describe("notAuthenticatedProcedure", () => {
    it("should accept no session id", () => {
      expect(
        $trpcCaller.signIn({
          email: "test@testing.com",
          password: "passwordABC",
        }),
      ).resolves.toBeTruthy();
    });

    it("should reject with valid session id", () => {
      cookies.set("sessionId", "middleware-test-session");
      expect(
        $trpcCaller.signIn({
          email: "test@testing.com",
          password: "passwordABC",
        }),
      ).rejects.toMatchObject({ code: "FORBIDDEN" });
    });

    it("should accept expired session id", () => {
      cookies.set("sessionId", "middleware-test-session-expired");
      expect(
        $trpcCaller.signIn({
          email: "test@testing.com",
          password: "passwordABC",
        }),
      ).resolves.toBeTruthy();
    });

    it("should accept bad session id", () => {
      cookies.set("sessionId", "XXX");
      expect(
        $trpcCaller.signIn({
          email: "test@testing.com",
          password: "passwordABC",
        }),
      ).resolves.toBeTruthy();
    });
  });
});
