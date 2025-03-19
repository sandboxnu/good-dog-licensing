import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "bun:test";
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
      userId: "musician-id-1",
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
      userId: "musician-id-1",
      sessionId: "500",
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

// Delete the records created for these tests
afterAll(async () => {
  await prisma.$transaction([
    prisma.user.deleteMany({
      where: {
        email: {
          in: ["person1@prisma.io", "person2@gmail.com", "person3@gmail.com"],
        },
      },
    }),
    prisma.musicianGroup.deleteMany({
      where: {
        name: "person1-group-id",
      },
    }),
  ]);
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
  test("An Admin can submit music", async () => {
    // Temporarily update Person 1's role to ADMIN
    await prisma.user.update({
      where: { email: "person1@prisma.io" },
      data: { role: "ADMIN" },
    });

    // Set the cookies
    mockCookies.set("sessionId", "500");

    // Create music submission
    const response = await $api.submitMusic({
      groupId: "person1-group-id",
      songName: "Admin Test Song",
      songLink: "https://example.com/admin-song",
      genre: "Jazz",
      songwriters: [{ email: "person2@gmail.com" }],
      additionalInfo: "Admin additional info",
    });

    expect(response.message).toEqual("Music submitted successfully");

    const musicSubmission = await prisma.musicSubmission.findFirst({
      where: { songName: "Admin Test Song" },
    });

    expect(musicSubmission?.songName).toEqual("Admin Test Song");
    expect(musicSubmission?.songLink).toEqual("https://example.com/admin-song");
    expect(musicSubmission?.genre).toEqual("Jazz");
    expect(musicSubmission?.additionalInfo).toEqual("Admin additional info");

    // Reset Person 1's role to MUSICIAN
    await prisma.user.update({
      where: { email: "person1@prisma.io" },
      data: { role: "MUSICIAN" },
    });
  });
  test("A Media Maker cannot submit music", async () => {
    // Temporarily update Person 1's role to MEDIA_MAKER
    await prisma.user.update({
      where: { email: "person1@prisma.io" },
      data: { role: "MEDIA_MAKER" },
    });

    // Set the cookies
    mockCookies.set("sessionId", "500");

    // Attempt to create music submission
    await expect(
      $api.submitMusic({
        groupId: "person1-group-id",
        songName: "Media Maker Test Song",
        songLink: "https://example.com/media-maker-song",
        genre: "Pop",
        songwriters: [{ email: "person2@gmail.com" }],
        additionalInfo: "Media Maker additional info",
      }),
    ).rejects.toThrow("Only musicians can submit music");

    // Reset Person 1's role to MUSICIAN
    await prisma.user.update({
      where: { email: "person1@prisma.io" },
      data: { role: "MUSICIAN" },
    });
  });
});
