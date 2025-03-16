import { afterEach, beforeAll, describe, expect, test } from "bun:test";
import { ZodError } from "zod";

import { prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockEmailService } from "../mocks/MockEmailService";
import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

const mockCookies = new MockNextCookies();
const mockEmails = new MockEmailService();

const $api = $createTrpcCaller({
  cookiesService: createMockCookieService(mockCookies),
  prisma: prisma,
});

beforeAll(async () => {
  await prisma.user.create({
    data: {
      email: "person1@prisma.io",
      firstName: "Person 1",
      lastName: "Smith",
      role: "MUSICIAN",
      hashedPassword: "person1Password",
      userId: "musician-id",
      phoneNumber: "1234567890",
      musicianGroups: {
        create: {
          groupId: "person1-group-id",
          name: "Person 1 Group",

          groupMembers: {
            createMany: {
              data: [
                {
                  firstName: "Person 2",
                  lastName: "Jones",
                  email: "person2@gmail.com",
                },
                {
                  firstName: "Person 3",
                  lastName: "Doe",
                  email: "person3@gmail.com",
                },
              ],
            },
          },
        },
      },
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

  // Create a MusicianGroup record
  await prisma.musicianGroup.create({
    data: {
      groupId: "person1-group-id",
      name: "Person 1 Group",
      organizerId: person1.userId,
      groupMembers: {
        createMany: {
          data: [
            {
              firstName: "Person 2",
              lastName: "Jones",
              email: "person2@gmail.com",
            },
            {
              firstName: "Person 3",
              lastName: "Doe",
              email: "person3@gmail.com",
            },
          ],
        },
      },
    },
  });
});

/*
  const person2 = await prisma.user.upsert({
    where: { email: "person2@gmail.com" },
    update: {},
    create: {
      email: "person2@gmail.com",
      firstName: "Person2",
      lastName: "Jones",
      role: "ADMIN",
      hashedPassword: "person2Password",
      phoneNumber: "1234566543",
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

  const person3 = await prisma.user.upsert({
    where: { email: "person3@prisma.io" },
    update: {},
    create: {
      email: "person3@prisma.io",
      firstName: "Person 3",
      lastName: "Doe",
      role: "MEDIA_MAKER",
      hashedPassword: "person3Password",
      phoneNumber: "1234563456",
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
      userId: person3.userId,
      sessionId: "503",
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
  });
  */

afterEach(() => {
  mockCookies.clear();
  mockEmails.clear();
});

describe("music-submission-procedure", () => {
  test("A Musician can submit music", async () => {
    // Set the cookies
    mockCookies.set("sessionId", "500");

    // Create music submission
    const response = await $api.submitMusic({
      groupId: "person1-group-id",
      songName: "Test Song",
      songLink: "https://example.com",
      genre: "Rock",
      songwriters: [{ email: "person2@gmail.com" }],
      additionalInfo: "Some additional info",
    });

    expect(response.message).toEqual("Music submitted successfully");

    const musicSubmission = await prisma.musicSubmission.findFirst({
      where: { songName: "Test Song" },
    });

    expect(musicSubmission?.songName).toEqual("Test Song");
    expect(musicSubmission?.songLink).toEqual("https://example.com");
    expect(musicSubmission?.genre).toEqual("Rock");
    expect(musicSubmission?.additionalInfo).toEqual("Some additional info");
  });
});
