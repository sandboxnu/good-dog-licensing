import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { GET } from "../../apps/web/app/api/cron/auto-match-music/route";
import { Genre, MatchState, prisma } from "@good-dog/db";
import { env } from "@good-dog/env";

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

describe("auto-approve-matches cron", () => {
  beforeAll(async () => {
    await prisma.$transaction([
      prisma.user.create({
        data: {
          userId: "cron-admin-id",
          email: "cron-admin@crontest.org",
          phoneNumber: "123456890",
          hashedPassword: "xxxx",
          firstName: "Cron",
          lastName: "Admin",
          role: "ADMIN",
        },
      }),
      prisma.user.create({
        data: {
          userId: "cron-media-maker-id",
          email: "cron-media@crontest.org",
          phoneNumber: "3216540987",
          hashedPassword: "xxxx",
          firstName: "Cron",
          lastName: "Media",
          role: "MEDIA_MAKER",
        },
      }),
      prisma.user.create({
        data: {
          userId: "cron-musician-id",
          email: "cron-musician@crontest.org",
          phoneNumber: "0987654321",
          hashedPassword: "xxxx",
          firstName: "Cron",
          lastName: "Musician",
          role: "MUSICIAN",
        },
      }),
    ]);

    await prisma.projectSubmission.create({
      data: {
        projectId: "cron-project-id",
        projectOwnerId: "cron-media-maker-id",
        projectTitle: "Cron Test Project",
        description: "Test project",
        deadline: new Date("2099-01-01"),
        projectType: "MOTION_PICTURE",
      },
    });

    await prisma.songRequest.create({
      data: {
        songRequestId: "cron-song-request-id",
        songRequestTitle: "Test Song Request",
        description: "Test description",
        similarSongs: "no similar songs",
        feelingsConveyed: "no feelings conveyed",
        projectId: "cron-project-id",
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
        ('cron-match-stale', 'cron-song-request-id', 'cron-music-stale', 'cron-admin-id', 'SENT_TO_MUSICIAN', ${daysAgo(10)}, ${new Date()}),
        ('cron-match-fresh', 'cron-song-request-id', 'cron-music-fresh', 'cron-admin-id', 'SENT_TO_MUSICIAN', ${daysAgo(2)}, ${new Date()}),
        ('cron-match-other-state', 'cron-song-request-id', 'cron-music-other-state', 'cron-admin-id', 'WAITING_FOR_MANAGER_APPROVAL', ${daysAgo(10)}, ${new Date()})
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
    await prisma.projectSubmission.deleteMany({
      where: { projectId: "cron-project-id" },
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            "cron-admin@crontest.org",
            "cron-media@crontest.org",
            "cron-musician@crontest.org",
          ],
        },
      },
    });
  });

  test("Auto-approves matches older than threshold", async () => {
    const staleMatchBefore = await prisma.match.findUnique({
      where: { matchId: "cron-match-stale" },
    });

    expect(staleMatchBefore?.matchState).toBe(MatchState.SENT_TO_MUSICIAN);
    const request = new Request(
      "http://localhost:3000/api/cron/auto-approve-matches",
      {
        headers: { authorization: `Bearer ${env.CRON_SECRET}` },
      },
    );

    const response = await GET(request);
    const body = (await response.json()) as {
      success: boolean;
      updatedCount: number;
    };

    expect(response.status).toBe(200);
    expect(body.updatedCount).toBe(1);

    const staleMatchAfter = await prisma.match.findUnique({
      where: { matchId: "cron-match-stale" },
    });
    expect(staleMatchAfter?.matchState).toBe(MatchState.APPROVED_BY_MUSICIAN);
  });

  test("Does not auto-approve matches newer than threshold", async () => {
    const newMatchBefore = await prisma.match.findUnique({
      where: { matchId: "cron-match-fresh" },
    });
    expect(newMatchBefore?.matchState).toBe(MatchState.SENT_TO_MUSICIAN);

    const request = new Request(
      "http://localhost:3000/api/cron/auto-approve-matches",
      {
        headers: { authorization: `Bearer ${env.CRON_SECRET}` },
      },
    );

    const response = await GET(request);
    const body = (await response.json()) as {
      success: boolean;
      updatedCount: number;
    };

    expect(response.status).toBe(200);
    expect(body.updatedCount).toBe(0);

    const newMatchAfter = await prisma.match.findUnique({
      where: { matchId: "cron-match-fresh" },
    });
    expect(newMatchAfter?.matchState).toBe(MatchState.SENT_TO_MUSICIAN);
  });

  test("Does not auto-approve matches in a different state", async () => {
    const otherMatchBefore = await prisma.match.findUnique({
      where: { matchId: "cron-match-other-state" },
    });
    expect(otherMatchBefore?.matchState).not.toBe(MatchState.SENT_TO_MUSICIAN);

    const request = new Request(
      "http://localhost:3000/api/cron/auto-approve-matches",
      {
        headers: { authorization: `Bearer ${env.CRON_SECRET}` },
      },
    );

    const response = await GET(request);
    const body = (await response.json()) as {
      success: boolean;
      updatedCount: number;
    };

    expect(response.status).toBe(200);
    expect(body.updatedCount).toBe(0);

    const otherMatchAfter = await prisma.match.findUnique({
      where: { matchId: "cron-match-other-state" },
    });
    expect(otherMatchAfter?.matchState).toBe(
      MatchState.WAITING_FOR_MANAGER_APPROVAL,
    );
  });
});
