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
          artist: {
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
          genre: "genre-1",
          group: {
            create: {
              groupId: "group-id-1",
              organizerId: "amoli-user-id",
              name: "Group One",
            },
          },
        },
      }),
      prisma.musicSubmission.create({
        data: {
          musicId: "music-id-2",
          songName: "song-name-2",
          artist: {
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
          genre: "genre-2",
          group: {
            create: {
              groupId: "group-id-2",
              organizerId: "amoli-user-id",
              name: "Group Two",
            },
          },
        },
      }),
      prisma.musicSubmission.create({
        data: {
          musicId: "music-id-3",
          songName: "song-name-3",
          artist: {
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
          genre: "genre-3",
          group: {
            create: {
              groupId: "group-id-3",
              organizerId: "amoli-user-id",
              name: "Group Three",
            },
          },
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
          in: ["music-id-1", "music-id-2", "music-id-3"],
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
          ],
        },
      },
    });
  });

  test("Correct music is returned when they have an ADMIN session.", async () => {
    cookies.set("sessionId", "owen-session-id");
    const { music } = await $api.music();

    expect(music).not.toBeNull();
    music.forEach((m) => {
      expect(m.musicId).toBeOneOf(["music-id-1", "music-id-2", "music-id-3"]);
    });
  });

  test("Correct music is returned when they have a MODERATOR session.", async () => {
    cookies.set("sessionId", "gavin-session-id");
    const { music } = await $api.music();

    expect(music).not.toBeNull();
    music.forEach((m) => {
      expect(m.musicId).toBeOneOf(["music-id-1", "music-id-2", "music-id-3"]);
    });
  });

  test("No music is returned when they have a NON MODERATOR OR ADMIN session.", () => {
    cookies.set("sessionId", "amoli-session-id");
    expect($api.music()).rejects.toThrow("permission to read");
  });
});
