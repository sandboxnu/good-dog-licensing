import { expect, test } from "bun:test";

import { _trpcCaller } from "@good-dog/trpc/server";

test("auth/signIn", async () => {
  const user = await _trpcCaller.signUp({
    email: "damian@gmail.com",
    password: "password",
  });

  const res = await _trpcCaller.signIn({
    email: "damian@gmail.com",
    password: "password",
  });

  const expectedRepsonse = {
    message: "Successfully signed up and logged in as damian@gmail.com",
    sessionToken: user.response.sessionToken,
  };

  expect(res.response).toEqual(expectedRepsonse);
});

test("auth/signOut", async () => {
  const signInResponse = await _trpcCaller.signIn({
    email: "test@email.com",
    password: "test",
  });
  expect(signInResponse.response.message).toEqual(
    "Successfully logged in as test@email.com",
  );

  const res = await _trpcCaller.signOut({
    token: signInResponse.response.sessionToken ?? "",
  });

  expect(res.response).toEqual("Successfully logged out");
});
