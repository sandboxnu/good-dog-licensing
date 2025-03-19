import { afterAll, afterEach, beforeAll, expect, test } from "bun:test";

import { prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";
import { emailService } from "@good-dog/email";

const cookies = new MockNextCookies();

const $api = $createTrpcCaller({
  cookiesService: createMockCookieService(cookies),
  prisma: prisma,
});

// Seeds the database before running the tests
beforeAll(async () => {
  const person1 = await prisma.user.upsert({
    where: { email: "person1@prisma.io" },
    update: {},
    create: {
      email: "person1@prisma.io",
      phoneNumber: "1234567890",
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
      phoneNumber: "1234567890",
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

afterEach(() => {
  cookies.clear();
});

test("Correct user is returned when they have a valid session.", async () => {
  // Set the cookies
  cookies.set("sessionId", "500");

  const user = await $api.authenticatedUser();

  expect(user.email).toEqual("person1@prisma.io");
  expect(user.phoneNumber).toEqual("1234567890");
});

test("Correct user is returned when they have multiple sessions and one is valid.", async () => {
  // Set the cookies
  cookies.set("sessionId", "502");

  const user = await $api.authenticatedUser();

  expect(user.email).toEqual("person2@gmail.com");
  expect(user.phoneNumber).toEqual("1234567890");});

test("'UNAUTHORIZED' error is thrown when no session is found for the sessionId.", () => {
  // Set the cookies
  cookies.set("sessionId", "503");

  const getUser = async () => await $api.authenticatedUser();

  expect(getUser).toThrow("UNAUTHORIZED");
});

test("'UNAUTHORIZED' error is thrown when there is no 'sessionId' cookie.", () => {
  const getUser = async () => await $api.authenticatedUser();
  expect(getUser).toThrow("UNAUTHORIZED");
});

test("'UNAUTHORIZED' error is thrown when session is expired.", () => {
  // Set the cookies
  cookies.set("sessionId", "501");

  const getUser = async () => await $api.authenticatedUser();

  expect(getUser).toThrow("UNAUTHORIZED");
});

test("Endpoint does not return the user's password.", async () => {
  // Set the cookies
  cookies.set("sessionId", "502");

  const user = await $api.authenticatedUser();

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
