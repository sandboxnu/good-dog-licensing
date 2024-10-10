import { beforeEach, describe, expect, test } from "bun:test";

import { _trpcCaller } from "@good-dog/trpc/server";

describe("auth", () => {
  beforeEach(async () => {
    try {
      await _trpcCaller.deleteAccount({
        email: "damian@gmail.com",
      });
    } catch (error) {
      if (error.message !== `No user found for damian@gmail.com`) {
        throw new Error(error);
      }
    }
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

    expect(
      _trpcCaller.signUp({
        email: "damian@gmail.com",
        password: "password",
      }),
    ).rejects.toThrow("User already exists for damian@gmail.com");
  });

  test("auth/signIn", async () => {
    await _trpcCaller.signUp({
      email: "damian@gmail.com",
      password: "password",
    });

    const signInResponse = await _trpcCaller.signIn({
      email: "damian@gmail.com",
      password: "password",
    });

    expect(signInResponse.response.message).toEqual(
      "Successfully logged in as damian@gmail.com",
    );

    await _trpcCaller.signOut({
      token: signInResponse.response.sessionToken ?? "",
    });

    expect(
      _trpcCaller.signIn({
        email: "damian@gmail.com",
        password: "thisIsTheWrongPassword",
      }),
    ).rejects.toThrow("Invalid credentials");
  });

  test("auth/signOut", async () => {
    await _trpcCaller.signUp({
      email: "damian@gmail.com",
      password: "password",
    });

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

  test("auth/deleteAccount", async () => {
    await _trpcCaller.signUp({
      email: "damian@gmail.com",
      password: "password",
    });

    const deleteAccountResponse = await _trpcCaller.deleteAccount({
      email: "damian@gmail.com",
    });

    expect(deleteAccountResponse.response).toEqual(
      "Successfully deleted account",
    );
  });
});
