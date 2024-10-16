import { afterAll, beforeAll, expect, test } from "bun:test";

import { prisma } from "@good-dog/db";
import { _trpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";

// Seeds the database before running the tests
beforeAll(async () => {
  const person1 = await prisma.user.upsert({
    where: { email: "person1@prisma.io" },
    update: {},
    create: {
      email: "person1@prisma.io",
      name: "Person 1",
      password: "person1Password",
    },
  });
  await prisma.session.upsert({
    where: { token: "person1Token" },
    update: {
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
    create: {
      userId: person1.id,
      token: "person1Token",
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
      name: "Person2 Jones",
      password: "person2Password",
    },
  });
  await prisma.session.upsert({
    where: { token: "person2Token1" },
    update: {
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    },
    create: {
      userId: person2.id,
      token: "person2Token1",
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    },
  });
  await prisma.session.upsert({
    where: { token: "person2Token2" },
    update: {
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
    create: {
      userId: person2.id,
      token: "person2Token2",
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
  });
});

test("Correct user is returned when they have a valid session.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionToken", "person1Token");
  await cookies.apply();

  const user = await _trpcCaller.user();

  expect(user.email).toEqual("person1@prisma.io");
});

test("Correct user is returned when they have multiple sessions and one is valid.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionToken", "person2Token2");
  await cookies.apply();

  const user = await _trpcCaller.user();

  expect(user.email).toEqual("person2@gmail.com");
});

test("'UNAUTHORIZED' error is thrown when no session is found for the token.", async () => {
  // Set the cookies
  const cookies = new MockNextCookies();
  cookies.set("sessionToken", "kjhakhouadakjs");
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
  cookies.set("sessionToken", "person2Token1");
  await cookies.apply();

  const getUser = async () => await _trpcCaller.user();

  expect(getUser).toThrow("UNAUTHORIZED");
});

// Delete the records created for these tests
afterAll(async () => {
  await prisma.session.delete({
    where: { token: "person1Token" },
  });
  await prisma.session.delete({
    where: { token: "person2Token1" },
  });
  await prisma.session.delete({
    where: { token: "person2Token2" },
  });
  await prisma.user.delete({
    where: { email: "person1@prisma.io" },
  });
  await prisma.user.delete({
    where: { email: "person2@gmail.com" },
  });
});
