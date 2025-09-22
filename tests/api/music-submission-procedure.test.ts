import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "bun:test";

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
  ]);
});

describe("music-submission-procedure", () => {
  test("A Musician can submit music", async () => {
    // Set the cookies
    mockCookies.set("sessionId", "500");

    // Create music submission
    const response = await $api.submitMusic({
      songName: "Test Song",
      songLink: "https://example.com",
      genre: ["Rock"],
      additionalInfo: "Some additional info",
      performerName: "The Beatles",
    });

    expect(response.message).toEqual("Music submitted successfully");

    const musicSubmission = await prisma.musicSubmission.findFirst({
      where: { songName: "Test Song" },
    });

    expect(musicSubmission?.songName).toEqual("Test Song");
    expect(musicSubmission?.songLink).toEqual("https://example.com");
    expect(musicSubmission?.genre).toEqual("Rock");
    expect(musicSubmission?.additionalInfo).toEqual("Some additional info");
    expect(musicSubmission?.performerName).toEqual("The Beatles");
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
      songName: "Admin Test Song",
      songLink: "https://example.com/admin-song",
      genre: ["Jazz"],
      additionalInfo: "Admin additional info",
      performerName: "Grateful Dead",
    });

    expect(response.message).toEqual("Music submitted successfully");

    const musicSubmission = await prisma.musicSubmission.findFirst({
      where: { songName: "Admin Test Song" },
    });

    expect(musicSubmission?.songName).toEqual("Admin Test Song");
    expect(musicSubmission?.songLink).toEqual("https://example.com/admin-song");
    expect(musicSubmission?.genre).toEqual("Jazz");
    expect(musicSubmission?.additionalInfo).toEqual("Admin additional info");
    expect(musicSubmission?.performerName).toEqual("Grateful Dead");

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
    expect(
      $api.submitMusic({
        songName: "Media Maker Test Song",
        songLink: "https://example.com/media-maker-song",
        genre: ["Pop"],
        additionalInfo: "Media Maker additional info",
        performerName: "JP's Band",
      }),
    ).rejects.toThrow("permission to submit");

    // Reset Person 1's role to MUSICIAN
    await prisma.user.update({
      where: { email: "person1@prisma.io" },
      data: { role: "MUSICIAN" },
    });
  });
});
