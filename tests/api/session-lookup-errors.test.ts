import { describe, expect, test } from "bun:test";

import type { prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

const session = {
  sessionId: "flaky-session",
  expiresAt: new Date(Date.now() + 60_000 * 60),
  user: {
    userId: "flaky-user",
    firstName: "Flaky",
    lastName: "Database",
    email: "flaky@test.com",
    phoneNumber: "1234567890",
    role: "ADMIN",
    affiliation: null,
    otherAffiliationName: null,
    ipi: null,
    publisher: null,
    publisherIpi: null,
    createdAt: new Date(),
    active: true,
  },
};

/**
 * A stand-in for Prisma whose session lookup throws the given number of
 * times (like a full connection pooler) before returning `result`.
 */
function prismaFailingTimes(failures: number, result: unknown = session) {
  let calls = 0;
  const fake = {
    session: {
      findUnique: () => {
        calls++;
        if (calls <= failures) {
          return Promise.reject(
            new Error(
              "(EMAXCONNSESSION) max clients reached in session mode - max clients are limited to pool_size: 15",
            ),
          );
        }
        return Promise.resolve(result);
      },
    },
  };
  return { fake: fake as unknown as typeof prisma, calls: () => calls };
}

function callerFor(fakePrisma: typeof prisma, sessionId: string) {
  const cookies = new MockNextCookies();
  cookies.set("sessionId", sessionId);
  return $createTrpcCaller({
    cookiesService: createMockCookieService(cookies),
    prisma: fakePrisma,
  });
}

describe("session lookup when the database errors", () => {
  test("a single failure is retried and the user stays logged in", async () => {
    const { fake, calls } = prismaFailingTimes(1);

    const user = await callerFor(fake, "retry-once-session").user();

    expect(user?.userId).toBe("flaky-user");
    expect(calls()).toBe(2);
  });

  test("repeated failures raise an error instead of logging the user out", async () => {
    const { fake, calls } = prismaFailingTimes(2);

    const error = await callerFor(fake, "always-fails-session")
      .user()
      .then(
        () => null,
        (e: unknown) => e,
      );

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe(
      "Could not verify your session. Please try again.",
    );
    expect(calls()).toBe(2);
  });

  test("a missing session still means logged out", async () => {
    const { fake } = prismaFailingTimes(0, null);

    expect(await callerFor(fake, "missing-session").user()).toBeNull();
  });
});
