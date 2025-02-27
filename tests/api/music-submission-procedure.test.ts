import { afterEach, beforeAll, describe, expect, test } from "bun:test";
import { ZodError } from "zod";

import { prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockEmailService } from "../mocks/MockEmailService";
import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

//bun db:studio

const mockCookies = new MockNextCookies();
const mockEmails = new MockEmailService();

const $api = $createTrpcCaller({
  cookiesService: createMockCookieService(mockCookies),
  prisma: prisma,
});

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
      userId: "musician-id",
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
      role: "ADMIN",
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

  const person3 = await prisma.user.upsert({
    where: { email: "person3@prisma.io" },
    update: {},
    create: {
      email: "person3@prisma.io",
      firstName: "Person 3",
      lastName: "Doe",
      role: "MEDIA_MAKER",
      hashedPassword: "person3Password",
    },
  });
  await prisma.session.upsert({
    where: { sessionId: "503" },
    update: {
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
    create: {
      userId: person1.userId,
      sessionId: "503",
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
  });
});

afterEach(() => {
  mockCookies.clear();
  mockEmails.clear();
});

test("A Musician can submit music", async () => {
  //Set the cookies
  mockCookies.set("sessionId", "500");

  //Create music submission
  const response = await $api.submitMusic({
    groupId: "group-id",
    songName: "Test Song",
    songLink: "https://example.com",
    genre: "Rock",
    songwriters: [{ userId: "musician-id" }],
    additionalInfo: "Some additional info",
  });

  const user = await $api.authenticatedUser();

  expect(response.message).toEqual("Music submitted successfully");
  expect(response).not.toBeNull();
});
