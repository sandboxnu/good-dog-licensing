import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "bun:test";

import { Genre, MusicAffiliation, MusicRole, prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockEmailService } from "../../mocks/MockEmailService";
import { MockNextCookies } from "../../mocks/MockNextCookies";
import { createMockCookieService } from "../../mocks/util";

// Set up the mock services
const mockCookies = new MockNextCookies();
const mockEmails = new MockEmailService();

const $api = $createTrpcCaller({
  cookiesService: createMockCookieService(mockCookies),
  prisma: prisma,
});

beforeAll(async () => {
  await prisma.user.create({
    // Create a Musician user
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
          in: ["person1@prisma.io"],
        },
      },
    }),
  ]);
});

// Create music contributors
const musicContributor1 = {
  firstName: "Admin",
  lastName: "Contributor",
  roles: [MusicRole.SONGWRITER],
  affiliation: MusicAffiliation.ASCAP,
  ipi: "1234",
};

const musicContributor2 = {
  firstName: "Contributor",
  lastName: "Two",
  roles: [MusicRole.LYRICIST, MusicRole.PRODUCER],
  affiliation: MusicAffiliation.ASCAP,
  ipi: "5555",
};

const musicContributor3 = {
  firstName: "Contributor",
  lastName: "Three",
  roles: [MusicRole.PRODUCER],
  affiliation: MusicAffiliation.BMI,
  ipi: "0918",
};

describe("music-submission-procedure", () => {
  test("A Musician can submit music", async () => {
    // Set the cookies
    mockCookies.set("sessionId", "500");

    // Create music submission
    const response = await $api.submitMusic({
      songName: "Test Song",
      songLink: "https://example.com",
      genres: [Genre.ROCK],
      additionalInfo: "Some additional info",
      performerName: "The Beatles",
      contributors: [musicContributor1, musicContributor2, musicContributor3],
      submitterRoles: [MusicRole.SONGWRITER, MusicRole.LYRICIST],
      submitterAffiliation: MusicAffiliation.ASCAP,
      submitterIpi: "1234",
    });

    // Verify that the music submission was created successfully
    expect(response.message).toEqual("Music submitted successfully");

    const [
      musicSubmission,
      submitter,
      contributor1,
      contributor2,
      contributor3,
    ] = await prisma.$transaction([
      prisma.musicSubmission.findFirst({
        where: { songName: "Test Song" },
      }),
      prisma.musicContributor.findFirst({
        where: { firstName: "Person 1" },
      }),
      prisma.musicContributor.findFirst({
        where: { firstName: "Admin", lastName: "Contributor" },
      }),
      prisma.musicContributor.findFirst({
        where: { firstName: "Contributor", lastName: "Two" },
      }),
      prisma.musicContributor.findFirst({
        where: { firstName: "Contributor", lastName: "Three" },
      }),
    ]);

    // Verify that the music submission fields are updated correctly
    expect(musicSubmission?.songName).toEqual("Test Song");
    expect(musicSubmission?.songLink).toEqual("https://example.com");
    expect(musicSubmission?.genres).toEqual([Genre.ROCK]);
    expect(musicSubmission?.additionalInfo).toEqual("Some additional info");
    expect(musicSubmission?.performerName).toEqual("The Beatles");
    expect(musicSubmission?.submitterId).toEqual("musician-id-1");

    // Verify that the submitter fields are updated correctly
    expect(submitter?.firstName).toEqual("Person 1");
    expect(submitter?.lastName).toEqual("Smith");
    expect(submitter?.roles).toEqual(["SONGWRITER", "LYRICIST"]);
    expect(submitter?.affiliation).toEqual("ASCAP");
    expect(submitter?.ipi).toEqual("1234");
    expect(submitter?.isSubmitter).toBe(true);

    expect(contributor1?.isSubmitter).toEqual(false);
    expect(contributor2?.isSubmitter).toEqual(false);
    expect(contributor3?.isSubmitter).toEqual(false);
  });

  test("An Admin can submit music", async () => {
    // Temporarily update Person 1's role to ADMIN
    await prisma.user.update({
      where: { userId: "musician-id-1" },
      data: { role: "ADMIN" },
    });

    // Set the cookies
    mockCookies.set("sessionId", "500");

    // Create music submission
    const response = await $api.submitMusic({
      songName: "Admin Test Song",
      songLink: "https://example.com/admin-song",
      genres: [Genre.JAZZ],
      additionalInfo: "Admin additional info",
      performerName: "Grateful Dead",
      contributors: [],
      submitterRoles: ["INSTRUMENTALIST"],
      submitterAffiliation: MusicAffiliation.NONE,
      submitterIpi: "1234",
    });

    expect(response.message).toEqual("Music submitted successfully");

    const musicSubmission = await prisma.musicSubmission.findFirst({
      where: { songName: "Admin Test Song" },
    });

    const submitter = await prisma.musicContributor.findFirst({
      where: { firstName: "Person 1", lastName: "Smith" },
    });

    expect(musicSubmission?.songName).toEqual("Admin Test Song");
    expect(musicSubmission?.songLink).toEqual("https://example.com/admin-song");
    expect(musicSubmission?.genres).toEqual([Genre.JAZZ]);
    expect(musicSubmission?.additionalInfo).toEqual("Admin additional info");
    expect(musicSubmission?.performerName).toEqual("Grateful Dead");
    expect(musicSubmission?.submitterId).toEqual("musician-id-1");

    expect(submitter?.isSubmitter).toEqual(true);

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
        songName: "Test Song",
        songLink: "https:fakesonglink.com",
        genres: [Genre.HIP_HOP],
        additionalInfo: "None",
        performerName: "Anon",
        contributors: [musicContributor1],
        submitterRoles: ["SONGWRITER"],
        submitterAffiliation: "ASCAP",
        submitterIpi: "1234",
      }),
      // Verify that the submission is rejected due to insufficient permissions
    ).rejects.toThrow("permission to submit");

    // Reset Person 1's role to MUSICIAN
    await prisma.user.update({
      where: { email: "person1@prisma.io" },
      data: { role: "MUSICIAN" },
    });
  });

  test("User's IPI updates when they submit a new one", async () => {
    // Set up the initial ipi for the user
    await prisma.user.update({
      where: { userId: "musician-id-1" },
      data: { ipi: "1111" },
    });

    // Create a music usbmission with a different ipi
    mockCookies.set("sessionId", "500");
    await $api.submitMusic({
      songName: "IPI Updates Test Song",
      songLink: "https://example.com/ipi-update",
      genres: [Genre.POP],
      additionalInfo: "Test update IPI",
      performerName: "Artist Test",
      contributors: [],
      submitterRoles: [MusicRole.SONGWRITER],
      submitterAffiliation: MusicAffiliation.ASCAP,
      submitterIpi: "1234",
    });

    // Verify that the user's IPI was updated in the DB
    const userAfterSubmission = await prisma.user.findUnique({
      where: { userId: "musician-id-1" },
      select: { ipi: true },
    });
    expect(userAfterSubmission?.ipi).toBe("1234");
    expect(userAfterSubmission?.ipi).not.toBe("1111");
  });

  test("User's IPI stays the same if they don't submit new one", async () => {
    // Set up the initial ipi for the user
    await prisma.user.update({
      where: { userId: "musician-id-1" },
      data: { ipi: "9876" },
    });

    // Create a music submission with a different ipi
    mockCookies.set("sessionId", "500");
    await $api.submitMusic({
      songName: "IPI Updates Test Song",
      songLink: "https://example.com/ipi-update",
      genres: [Genre.POP],
      additionalInfo: "Test update IPI",
      performerName: "Artist Test",
      contributors: [],
      submitterRoles: [MusicRole.SONGWRITER],
      submitterAffiliation: MusicAffiliation.NONE,
      submitterIpi: undefined,
    });

    // Verify that the user's IPI was updated in the DB
    const userAfterSubmission = await prisma.user.findUnique({
      where: { userId: "musician-id-1" },
      select: { ipi: true },
    });
    expect(userAfterSubmission?.ipi).toBe("9876");
  });
});
