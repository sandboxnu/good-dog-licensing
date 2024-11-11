import { afterAll, beforeAll, expect, test } from "bun:test";

import { prisma } from "@good-dog/db";
import { $trpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";

// Seeds the database before running the tests
beforeAll(async () => {
  const person1 = await prisma.user.upsert({
    where: { email: "person1@prisma.io" },
    update: {},
    create: {
      email: "person1@prisma.io",
      firstName: "Person 1",
      lastName: "Smith",
      role: "MUSICIAN",
      hashedPassword: "person1Password",
    },
  });
  await prisma.session.upsert({
    where: { sessionId: "500" },
    update: {
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
    create: {
      userId: person1.userId,
      sessionId: "500",
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
  });

  const person2 = await prisma.user.upsert({
    where: { email: "person2@gmail.com" },
    update: {},
    create: {
      email: "person2@gmail.com",
      firstName: "Person2",
      lastName: "Jones",
      role: "MUSICIAN",
      hashedPassword: "person2Password",
    },
  });
  await prisma.session.upsert({
    where: { sessionId: "501" },
    update: {
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    },
    create: {
      userId: person2.userId,
      sessionId: "501",
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    },
  });
  await prisma.session.upsert({
    where: { sessionId: "502" },
    update: {
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
    create: {
      userId: person2.userId,
      sessionId: "502",
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
  });
});

test("Correct user is returned when they have a valid session.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionId", "500");
  await cookies.apply();

  const user = await $trpcCaller.authenticatedUser();

  expect(user.email).toEqual("person1@prisma.io");
});

test("Correct user is returned when they have multiple sessions and one is valid.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionId", "502");
  await cookies.apply();

  const user = await $trpcCaller.authenticatedUser();

  expect(user.email).toEqual("person2@gmail.com");
});

test("'UNAUTHORIZED' error is thrown when no session is found for the sessionId.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionId", "503");
  await cookies.apply();

  const getUser = async () => await $trpcCaller.authenticatedUser();

  expect(getUser).toThrow("UNAUTHORIZED");
});

test("'UNAUTHORIZED' error is thrown when there is no 'sessionId' cookie.", async () => {
  const cookies = new MockNextCookies();
  await cookies.apply();

  const getUser = async () => await $trpcCaller.authenticatedUser();
  expect(getUser).toThrow("UNAUTHORIZED");
});

test("'UNAUTHORIZED' error is thrown when session is expired.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionId", "501");
  await cookies.apply();

  const getUser = async () => await $trpcCaller.authenticatedUser();

  expect(getUser).toThrow("UNAUTHORIZED");
});

test("Endpoint does not return the user's password.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionId", "502");
  await cookies.apply();

  const user = await $trpcCaller.authenticatedUser();

  expect(user).not.toHaveProperty("hashedPassword");
  expect(user).not.toHaveProperty("password");
});

// Delete the records created for these tests
afterAll(async () => {
  await Promise.all([
    prisma.user.delete({
      where: { email: "person1@prisma.io" },
    }),
    prisma.user.delete({
      where: { email: "person2@gmail.com" },
    }),
  ]);
});
