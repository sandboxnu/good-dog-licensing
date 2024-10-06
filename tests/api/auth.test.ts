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