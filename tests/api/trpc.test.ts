import { beforeAll, describe, expect, test } from "bun:test";
import { ZodError } from "zod";

import { $trpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";

describe("error formatting", () => {
  const cookies = new MockNextCookies();
  beforeAll(async () => {
    await cookies.apply();
  });

  test("should format error with cause", () => {
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
