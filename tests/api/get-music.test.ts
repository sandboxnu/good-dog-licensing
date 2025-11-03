import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "bun:test";

import { prisma, Role } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

describe("get-music", () => {
  // Seeds the database before running the tests
  beforeAll(async () => {
    await prisma.$transaction([
      prisma.user.create({
        data: {
          userId: "owen-user-id",
          email: "owen@test.org",
          phoneNumber: "1234567890",
          hashedPassword: "xxxx",
          firstName: "Owen",
          lastName: "Simpson",
          role: "ADMIN",
          sessions: {
            create: {
              sessionId: "owen-session-id",
              expiresAt: new Date(Date.now() + 5_000_000_000),
            },
          },
        },
      }),
      prisma.user.create({
        data: {
          userId: "gavin-user-id",
          email: "gavin@test.org",
          phoneNumber: "4173843849",
          hashedPassword: "xxxx",
          firstName: "Gavin",
          lastName: "Normand",
          role: "MODERATOR",
          sessions: {
            create: {
              sessionId: "gavin-session-id",
              expiresAt: new Date(Date.now() + 600_000),
            },
          },
        },
      }),
      prisma.user.create({
        data: {
          userId: "amoli-user-id",
          email: "amoli@test.org",
          phoneNumber: "1987654323",
          hashedPassword: "xxxx",
          firstName: "Amoli",
          lastName: "Patel",
          role: "MEDIA_MAKER",
          sessions: {
            create: {
              sessionId: "amoli-session-id",
              expiresAt: new Date(Date.now() + 600_000),
            },
          },
        },
      }),
      prisma.musicSubmission.create({
        data: {
          musicId: "music-id-1",
          songName: "song-name-1",
          submitter: {
            create: {
              userId: "artists-user-id-1",
              email: "artist1@gmail.com",
              phoneNumber: "1234567890",
              hashedPassword: "xxxx",
              firstName: "Artist",
              lastName: "One",
              role: Role.MUSICIAN,
            },
          },
          songLink: "https://www.youtube.com/1",
          genre: ["genre-1"],
          performerName: "The Beatles",
        },
      }),
      prisma.musicSubmission.create({
        data: {
          musicId: "music-id-2",
          songName: "song-name-2",
          submitter: {
            create: {
              userId: "artists-user-id-2",
              email: "artist2@gmail.com",
              phoneNumber: "1234567890",
              hashedPassword: "xxxx",
              firstName: "Artist",
              lastName: "Two",
              role: Role.MUSICIAN,
            },
          },
          songLink: "https://www.youtube.com/2",
          genre: ["genre-2"],
          performerName: "Grateful Dead",
        },
      }),
      prisma.musicSubmission.create({
        data: {
          musicId: "music-id-3",
          songName: "song-name-3",
          submitter: {
            create: {
              userId: "artists-user-id-3",
              email: "artist3@gmail.com",
              phoneNumber: "1234567890",
              hashedPassword: "xxxx",
              firstName: "Artist",
              lastName: "Three",
              role: Role.MUSICIAN,
            },
          },
          songLink: "https://www.youtube.com/3",
          genre: ["genre-3"],
          performerName: "Taylor Swift",
        },
      }),
      prisma.user.create({
        data: {
          userId: "anzhuo-musician-id",
          email: "anzhuo@test.org",
          phoneNumber: "8889990000",
          hashedPassword: "xxxx",
          firstName: "Anzhuo",
          lastName: "Wang",
          role: "MUSICIAN",
          sessions: {
            create: {
              sessionId: "anzhuo-session-id",
              expiresAt: new Date(Date.now() + 600_000),
            },
          },
        },
      }),
      prisma.musicSubmission.create({
        data: {
          musicId: "anzhuo-music-1",
          songName: "Song 1",
          submitter: {
            connect: {
              userId: "anzhuo-musician-id",
            },
          },
          songLink: "https://www.youtube.com/song1",
          genre: ["genre3"],
          performerName: "The Rolling Stones",
        },
      }),
      prisma.musicSubmission.create({
        data: {
          musicId: "anzhuo-music-2",
          songName: "Song 2",
          submitter: {
            connect: {
              userId: "anzhuo-musician-id",
            },
          },
          songLink: "https://www.youtube.com/song2",
          genre: ["genre3"],
          performerName: "JP's Band",
        },
      }),
    ]);
  });

  const cookies = new MockNextCookies();

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(cookies),
    prisma: prisma,
  });

  afterEach(() => {
    cookies.clear();
  });

  // Delete the records created for these tests
  afterAll(async () => {
    await prisma.musicSubmission.deleteMany({
      where: {
        musicId: {
          in: [
            "music-id-1",
            "music-id-2",
            "music-id-3",
            "anzhuo-music-1",
            "anzhuo-music-2",
          ],
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        userId: {
          in: [
            "owen-user-id",
            "gavin-user-id",
            "amoli-user-id",
            "artists-user-id-1",
            "artists-user-id-2",
            "artists-user-id-3",
            "anzhuo-musician-id",
          ],
        },
      },
    });
  });

  // All submissions [admin/moderator]
  test("Correct music is returned when they have an ADMIN session.", async () => {
    cookies.set("sessionId", "owen-session-id");
    const { music } = await $api.music();

    expect(music).not.toBeNull();
    music.forEach((m) => {
      expect(m.musicId).toBeOneOf([
        "music-id-1",
        "music-id-2",
        "music-id-3",
        "anzhuo-music-1",
        "anzhuo-music-2",
      ]);
    });
  });

  test("Correct music is returned when they have a MODERATOR session.", async () => {
    cookies.set("sessionId", "gavin-session-id");
    const { music } = await $api.music();

    expect(music).not.toBeNull();
    music.forEach((m) => {
      expect(m.musicId).toBeOneOf([
        "music-id-1",
        "music-id-2",
        "music-id-3",
        "anzhuo-music-1",
        "anzhuo-music-2",
      ]);
    });
  });

  test("No music is returned when they have a NON MODERATOR OR ADMIN session.", () => {
    cookies.set("sessionId", "amoli-session-id");
    expect($api.music()).rejects.toThrow("permission to read");
  });

  // Retrieve by user [musician]
  test("Correct music is returned for a specific user when they have a MUSICIAN session.", async () => {
    cookies.set("sessionId", "anzhuo-session-id");
    const { music } = await $api.userMusic();

    expect(music).not.toBeNull();
    expect(music).toHaveLength(2);

    music.forEach((m) => {
      expect(m.submitter.userId).toBe("anzhuo-musician-id");
      expect(m.musicId).toBeOneOf(["anzhuo-music-1", "anzhuo-music-2"]);
      expect(m.musicId).not.toBeOneOf([
        "music-id-1",
        "music-id-2",
        "music-id-3",
      ]);
    });
  });

  test("No music is returned for a specific user when they have a NON MUSICIAN session.", () => {
    cookies.set("sessionId", "amoli-session-id");
    expect($api.userMusic()).rejects.toThrow(
      "You do not have permission to read this resource.",
    );
  });

  test("No music is returned when a user is unauthenticated.", () => {
    expect($api.userMusic()).rejects.toThrow("UNAUTHORIZED");
  });
});
