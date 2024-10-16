import { beforeAll, expect, test } from "bun:test";

import { prisma } from "@good-dog/db";
import { _trpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";

// Seeds the database before running the tests
beforeAll(async () => {
  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      name: "Alice",
      password: "alicePasswod",
    },
  });
  await prisma.session.upsert({
    where: { token: "aliceToken" },
    update: {
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
    create: {
      userId: alice.id,
      token: "aliceToken",
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@gmail.com" },
    update: {},
    create: {
      email: "bob@gmail.com",
      name: "Bob Jones",
      password: "bobPassword",
    },
  });
  await prisma.session.upsert({
    where: { token: "bobToken1" },
    update: {
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    },
    create: {
      userId: bob.id,
      token: "bobToken1",
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    },
  });
  await prisma.session.upsert({
    where: { token: "bobToken2" },
    update: {
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
    create: {
      userId: bob.id,
      token: "bobToken2",
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
  });
});

test("Correct user is returned when they have a valid session.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionToken", "aliceToken");
  await cookies.apply();

  const user = await _trpcCaller.user();

  expect(user.email).toEqual("alice@prisma.io");
});

test("Correct user is returned when they have multiple sessions and one is valid.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionToken", "bobToken2");
  await cookies.apply();

  const user = await _trpcCaller.user();

  expect(user.email).toEqual("bob@gmail.com");
});

test("'UNAUTHORIZED' error is thrown when no session is found for the token.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionToken", "testToken");
  await cookies.apply();

  const getUser = async () => await _trpcCaller.user();

  expect(getUser).toThrow("UNAUTHORIZED");
});

test("'UNAUTHORIZED' error is thrown when no session is found for the token.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionToken", "testToken");
  await cookies.apply();

  const getUser = async () => await _trpcCaller.user();

  expect(getUser).toThrow("UNAUTHORIZED");
});

test("'UNAUTHORIZED' error is thrown when there is no 'sessionToken' cookie.", async () => {
  const cookies = new MockNextCookies();
  await cookies.apply();

  const getUser = async () => await _trpcCaller.user();

  expect(getUser).toThrow("UNAUTHORIZED");
});

test("'UNAUTHORIZED' error is thrown when session is expired.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionToken", "bobToken1");
  await cookies.apply();

  const getUser = async () => await _trpcCaller.user();

  expect(getUser).toThrow("UNAUTHORIZED");
});
