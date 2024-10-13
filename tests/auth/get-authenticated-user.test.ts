import { expect, test } from "bun:test";

import { _trpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";

test("Correct user is returned when they have a valid session.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionToken", "aliceToken");

  const user = await _trpcCaller.user();

  expect(user.email).toEqual("alice@prisma.io");
});

test("Correct user is returned when they have multiple sessions and one is valid.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionToken", "bobToken2");

  const user = await _trpcCaller.user();

  expect(user.email).toEqual("bob@gmail.com");
});

test("'UNAUTHORIZED' error is thrown when no session is found for the token.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionToken", "testToken");

  const getUser = async () => await _trpcCaller.user();

  expect(getUser).toThrow("UNAUTHORIZED");
});

test("'UNAUTHORIZED' error is thrown when no session is found for the token.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionToken", "testToken");

  const getUser = async () => await _trpcCaller.user();

  expect(getUser).toThrow("UNAUTHORIZED");
});

test("'UNAUTHORIZED' error is thrown when there is no 'sessionToken' cookie.", async () => {
  const cookies = new MockNextCookies();

  const getUser = async () => await _trpcCaller.user();

  expect(getUser).toThrow("UNAUTHORIZED");
});

test("'UNAUTHORIZED' error is thrown when session is expired.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionToken", "bobToken1");

  const getUser = async () => await _trpcCaller.user();

  expect(getUser).toThrow("UNAUTHORIZED");
});
