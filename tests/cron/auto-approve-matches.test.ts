import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { GET } from "../../apps/web/app/api/cron/auto-match-music/route";
import { Genre, MatchState, prisma } from "@good-dog/db";

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

describe("auto-approve-matches cron", () => {
  beforeAll(async () => {
    await prisma.$transaction([
      prisma.user.create({
        data: {
          userId: "cron-admin-id",
          email: "cron-admin@test.org",
          phoneNumber: "0000000000",
          hashedPassword: "xxxx",
          firstName: "Cron",
          lastName: "Admin",
          role: "ADMIN",
        },
      }),
      prisma.user.create({
        data: {
          userId: "cron-media-maker-id",
          email: "cron-media@test.org",
          phoneNumber: "0000000001",
          hashedPassword: "xxxx",
          firstName: "Cron",
          lastName: "Media",
          role: "MEDIA_MAKER",
        },
      }),
      prisma.user.create({
        data: {
          userId: "cron-musician-id",
          email: "cron-musician@test.org",
          phoneNumber: "0000000002",
          hashedPassword: "xxxx",
          firstName: "Cron",
          lastName: "Musician",
          role: "MUSICIAN",
        },
      }),
    ]);

    await prisma.songRequest.create({
      data: {
        songRequestId: "cron-song-request-id",
        songRequestTitle: "Test Song Request",
        description: "Test description",
        similarSongs: "no similar songs",
        feelingsConveyed: "no feelings conveyed",
        projectId: "project-1",
      },
    });

    await prisma.musicSubmission.createMany({
      data: [
        {
          musicId: "cron-music-stale",
          songName: "Stale Song",
          submitterId: "cron-musician-id",
          songLink: "https://example.com/stale",
          performerName: "Cron",
        },
        {
          musicId: "cron-music-fresh",
          songName: "Fresh Song",
          submitterId: "cron-musician-id",
          songLink: "https://example.com/fresh",
          performerName: "Cron2",
        },
        {
          musicId: "cron-music-other-state",
          songName: "Other Song",
          submitterId: "cron-musician-id",
          songLink: "https://example.com/other",
          genres: [Genre.BLUES],
          performerName: "Cron3",
        },
      ],
    });

    // Create matches using raw SQL since matches are default createdAt now.
    await prisma.$executeRaw`
      INSERT INTO "Matches" ("matchId", "songRequestId", "musicId", "matcherUserId", "matchState", "createdAt", "updatedAt")
      VALUES
        ('cron-match-stale', 'cron-song-request-id-1', 'cron-music-stale', 'cron-admin-id', 'SENT_TO_MUSICIAN', ${daysAgo(10)}, ${new Date()}),
        ('cron-match-fresh', 'cron-song-request-id-2', 'cron-music-fresh', 'cron-admin-id', 'SENT_TO_MUSICIAN', ${daysAgo(2)}, ${new Date()}),
        ('cron-match-other-state', 'cron-song-request-id-3', 'cron-music-other-state', 'cron-admin-id', 'WAITING_FOR_MANAGER_APPROVAL', ${daysAgo(10)}, ${new Date()})
    `;
  });

  afterAll(async () => {
    await prisma.match.deleteMany({
      where: {
        matchId: {
          in: [
            "cron-match-stale",
            "cron-match-fresh",
            "cron-match-other-state",
          ],
        },
      },
    });
    await prisma.musicSubmission.deleteMany({
      where: {
        musicId: {
          in: [
            "cron-music-stale",
            "cron-music-fresh",
            "cron-music-other-state",
          ],
        },
      },
    });
    await prisma.songRequest.deleteMany({
      where: { songRequestId: "cron-song-request-id" },
    });
    await prisma.user.deleteMany({
      where: {
        userId: {
          in: ["cron-admin-id", "cron-media-maker-id", "cron-musician-id"],
        },
      },
    });
  });

  test("Auto-approves matches older than threshold", async () => {
    const staleMatch = await prisma.match.findUnique({
      where: { matchId: "cron-match-stale" },
    });

    expect(staleMatch?.matchState).toBe(MatchState.SENT_TO_MUSICIAN);
    const request = new Request(
      "http://localhost:3000/api/cron/auto-approve-matches",
      {
        headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
      },
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.updatedCount).toBe(1);

    expect(staleMatch?.matchState).toBe(MatchState.APPROVED_BY_MUSICIAN);
  });

  test("Does not auto-approve matches newer than threshold", async () => {
    const newMatch = await prisma.match.findUnique({
      where: { matchId: "cron-match-fresh" },
    });
    expect(newMatch?.matchState).toBe(MatchState.SENT_TO_MUSICIAN);

    const request = new Request(
      "http://localhost:3000/api/cron/auto-approve-matches",
      {
        headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
      },
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.updatedCount).toBe(0);
    expect(newMatch?.matchState).toBe(MatchState.SENT_TO_MUSICIAN);
  });

  test("Does not auto-approve matches in a different state", async () => {
    const otherMatch = await prisma.match.findUnique({
      where: { matchId: "cron-match-other-state" },
    });
    expect(otherMatch?.matchState).not.toBe(MatchState.SENT_TO_MUSICIAN);

    const request = new Request(
      "http://localhost:3000/api/cron/auto-approve-matches",
      {
        headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
      },
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.updatedCount).toBe(0);
    expect(otherMatch?.matchState).toBe(
      MatchState.WAITING_FOR_MANAGER_APPROVAL,
    );
  });
});
