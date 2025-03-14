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
  
  describe("submit unlicensed music", () => {
    // Seeds the database before running the tests
    beforeAll(async () => {
      await prisma.$transaction([
        prisma.user.create({
          data: {
            userId: "admin-user-id",
            email: "admin@test.org",
            phoneNumber: "1234567890",
            hashedPassword: "xxxx",
            firstName: "Admin",
            lastName: "LastName",
            role: Role.ADMIN,
            sessions: {
              create: {
                sessionId: "admin-session-id",
                expiresAt: new Date(Date.now() + 5_000_000_000),
              },
            },
          },
        }),
        prisma.user.create({
          data: {
            userId: "mod-user-id",
            email: "mod@test.org",
            phoneNumber: "4173843849",
            hashedPassword: "xxxx",
            firstName: "Mod",
            lastName: "NameLast",
            role: Role.MODERATOR,
            sessions: {
              create: {
                sessionId: "mod-session-id",
                expiresAt: new Date(Date.now() + 600_000),
              },
            },
          },
        }),
        prisma.user.create({
          data: {
            userId: "media-user-id",
            email: "media@test.org",
            phoneNumber: "1987654323",
            hashedPassword: "xxxx",
            firstName: "Media",
            lastName: "Maker",
            role: Role.MEDIA_MAKER,
            sessions: {
              create: {
                sessionId: "media-session-id",
                expiresAt: new Date(Date.now() + 600_000),
              },
            },
          },
        }),
        prisma.user.create({
          data: {
            userId: "musician-user-id",
            email: "musician@test.org",
            phoneNumber: "4283716283",
            hashedPassword: "xxxx",
            firstName: "Musician",
            lastName: "LastName",
            role: Role.MUSICIAN,
            sessions: {
              create: {
                sessionId: "musician-session-id",
                expiresAt: new Date(Date.now() + 600_000),
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
      await prisma.unlicensedMusic.deleteMany({
        where: {
          songName: {
            in: ["unlicensed-music-name-1", "unlicensed-music-name-2", "unlicensed-music-name-3"],
          },
        },
      });
  
      await prisma.user.deleteMany({
        where: {
          userId: {
            in: [
              "admin-user-id",
              "mod-user-id",
              "media-user-id",
              "musician-user-id",
            ],
          },
        },
      });
    });
  
    test("Music is successfully submitted when the user is an Admin", async () => {
      cookies.set("sessionId", "admin-session-id");
      const {message} = await $api.submitUnlicensedMusic({
        songName: "unlicensed-music-name-1",
        artist: "unlicensed-music-artist-1",
        songLink: "https://unlicensed-music-link-1.com",
        genre: "unlicensed-music-genre-1",
      })
  
      expect(message).not.toBeNull();
      expect(message).toBe("Unlicensed Music submitted successfully");

      const music = await prisma.unlicensedMusic.findFirst({
        where: {
            songName: "unlicensed-music-name-1",
        }});
        
    expect(music).not.toBeNull();
    expect(music?.artist).toBe("unlicensed-music-artist-1");
    expect(music?.songLink).toBe("https://unlicensed-music-link-1.com");
    expect(music?.genre).toBe("unlicensed-music-genre-1");
    });

    test("Music is successfully submitted when the user is a Moderator", async () => {
        cookies.set("sessionId", "mod-session-id");
        const {message} = await $api.submitUnlicensedMusic({
          songName: "unlicensed-music-name-2",
          artist: "unlicensed-music-artist-2",
          songLink: "https://unlicensed-music-link-2.com",
          genre: "unlicensed-music-genre-2",
        })
    
        expect(message).not.toBeNull();
        expect(message).toBe("Unlicensed Music submitted successfully");

        const music = await prisma.unlicensedMusic.findFirst({
            where: {
                songName: "unlicensed-music-name-2",
            }});

        expect(music).not.toBeNull();
        expect(music?.artist).toBe("unlicensed-music-artist-2");
        expect(music?.songLink).toBe("https://unlicensed-music-link-2.com");
        expect(music?.genre).toBe("unlicensed-music-genre-2");
    });

    test("Music is not successfully submitted when the user is a Media Maker", () => {
        cookies.set("sessionId", "media-session-id");
        expect($api.submitUnlicensedMusic({
          songName: "unlicensed-music-name-3",
          artist: "unlicensed-music-artist-3",
          songLink: "https://unlicensed-music-link-3.com",
          genre: "unlicensed-music-genre-3",
      })).rejects.toThrow("FORBIDDEN");
    });

    test("Music is not successfully submitted when the user is a Musician", () => {
        cookies.set("sessionId", "musician-session-id");
        expect($api.submitUnlicensedMusic({
            songName: "unlicensed-music-name-3",
            artist: "unlicensed-music-artist-3",
            songLink: "https://unlicensed-music-link-3.com",
            genre: "unlicensed-music-genre-3",
        })).rejects.toThrow("FORBIDDEN");
    });
  });