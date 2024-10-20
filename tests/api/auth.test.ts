import { afterEach, describe, expect, test } from "bun:test";

import { _trpcCaller } from "@good-dog/trpc/server";

describe("auth", () => {
  describe("with account deletion", () => {
    afterEach(async () => {
      await _trpcCaller.deleteAccount({
        email: "damian@gmail.com",
      });
    });

    test("auth/signUp", async () => {
      const user = await _trpcCaller.signUp({
        email: "damian@gmail.com",
        password: "password",
      });

      const expectedResponse = {
        message: "Successfully signed up and logged in as damian@gmail.com",
        sessionId: user.sessionId,
      };

      expect(user).toEqual(expectedResponse);

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

      expect(signInResponse.message).toEqual(
        "Successfully logged in as damian@gmail.com",
      );

      expect(signInResponse.sessionId).toBeTruthy();

      if (signInResponse.sessionId) {
        await _trpcCaller.signOut({
          id: signInResponse.sessionId,
        });
      }

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
      expect(signInResponse.message).toEqual(
        "Successfully logged in as damian@gmail.com",
      );

      expect(signInResponse.sessionId).toBeTruthy();

      if (signInResponse.sessionId) {
        const res = await _trpcCaller.signOut({
          id: signInResponse.sessionId,
        });

        expect(res.message).toEqual("Successfully logged out");
      }
    });
  });

  test("auth/deleteAccount", async () => {
    await _trpcCaller.signUp({
      email: "damian@gmail.com",
      password: "password",
    });

    const deleteAccountResponse = await _trpcCaller.deleteAccount({
      email: "damian@gmail.com",
    });

    expect(deleteAccountResponse.message).toEqual(
      "Successfully deleted account",
    );
  });
});
