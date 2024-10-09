import { beforeAll, describe, expect, test } from "bun:test";

import { _trpcCaller } from "@good-dog/trpc/server";

describe("auth", () => {
  
  beforeAll(async () => {
    await _trpcCaller.deleteAccount({
      email: "damian@gmail.com",
    });
  });

  test("auth/signUp", async () => {
    const user = await _trpcCaller.signUp({
      email: "damian@gmail.com",
      password: "password",
    });

    const expectedRepsonse = {
      message: "Successfully signed up and logged in as damian@gmail.com",
      sessionToken: user.response.sessionToken,
    };

    expect(user.response).toEqual(expectedRepsonse);
  });

  test("auth/signIn", async () => {
    const res = await _trpcCaller.signIn({
      email: "damian@gmail.com",
      password: "password",
    });

    expect(res.response.message).toEqual(
      "Successfully logged in as damian@gmail.com",
    );
  });

  test("auth/signOut", async () => {
    const signInResponse = await _trpcCaller.signIn({
      email: "damian@gmail.com",
      password: "password",
    });
    expect(signInResponse.response.message).toEqual(
      "Successfully logged in as damian@gmail.com",
    );

    const res = await _trpcCaller.signOut({
      token: signInResponse.response.sessionToken ?? "",
    });

    expect(res.response).toEqual("Successfully logged out");
  });
});
