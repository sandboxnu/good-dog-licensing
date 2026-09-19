import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "bun:test";

import type { Role } from "@good-dog/db";
import { Genre, MusicAffiliation, MusicRole, prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockEmailService } from "../../mocks/MockEmailService";
import { MockNextCookies } from "../../mocks/MockNextCookies";
import { createMockCookieService } from "../../mocks/util";

const mockCookies = new MockNextCookies();
const mockEmails = new MockEmailService();

const $api = $createTrpcCaller({
  cookiesService: createMockCookieService(mockCookies),
  emailService: mockEmails,
  prisma: prisma,
});

const MUSICIAN_ID = "update-music-musician";
const STAFF_ID = "update-music-staff";
const MUSIC_ID = "update-music-submission";

const createUser = (userId: string, role: Role, sessionId: string) =>
  prisma.user.create({
    data: {
      userId,
      email: `${userId}@prisma.io`,
      firstName: "First",
      lastName: "Last",
      role,
      hashedPassword: "password",
      phoneNumber: "1234567890",
      sessions: {
        create: {
          sessionId,
          expiresAt: new Date(
            new Date().setFullYear(new Date().getFullYear() + 10),
          ),
        },
      },
    },
  });

const resetSubmission = () =>
  prisma.musicSubmission.upsert({
    where: { musicId: MUSIC_ID },
    update: {
      songName: "Original Song",
      contributors: {
        deleteMany: {},
        create: [
          {
            firstName: "First",
            lastName: "Last",
            roles: [MusicRole.SONGWRITER],
            affiliation: MusicAffiliation.ASCAP,
            ipi: "1111",
            isSubmitter: true,
          },
          {
            firstName: "Old",
            lastName: "Contributor",
            roles: [MusicRole.PRODUCER],
            isSubmitter: false,
          },
        ],
      },
    },
    create: {
      musicId: MUSIC_ID,
      submitterId: MUSICIAN_ID,
      songName: "Original Song",
      performerName: "Original Artist",
      songLink: "https://example.com/original",
      genres: [Genre.ROCK],
      additionalInfo: "Original info",
      songLyrics: "Original lyrics",
      contributors: {
        create: [
          {
            firstName: "First",
            lastName: "Last",
            roles: [MusicRole.SONGWRITER],
            affiliation: MusicAffiliation.ASCAP,
            ipi: "1111",
            isSubmitter: true,
          },
          {
            firstName: "Old",
            lastName: "Contributor",
            roles: [MusicRole.PRODUCER],
            isSubmitter: false,
          },
        ],
      },
    },
  });

const updatedValues = {
  musicId: MUSIC_ID,
  songName: "Corrected Song",
  songLink: "https://example.com/corrected",
  genres: [Genre.JAZZ],
  additionalInfo: "Corrected info",
  songLyrics: "Corrected lyrics",
  performerName: "Corrected Artist",
  contributors: [
    {
      firstName: "New",
      lastName: "Contributor",
      roles: [MusicRole.PRODUCER],
    },
  ],
  submitterRoles: [MusicRole.LYRICIST],
  submitterAffiliation: MusicAffiliation.BMI,
  submitterIpi: "2222",
};

beforeAll(async () => {
  // Any leftovers from an interrupted run would break the fixtures below.
  await prisma.user.deleteMany({
    where: { userId: { in: [MUSICIAN_ID, STAFF_ID] } },
  });

  await createUser(MUSICIAN_ID, "MUSICIAN", "update-music-session-musician");
  await createUser(STAFF_ID, "ADMIN", "update-music-session-staff");
  await resetSubmission();
});

afterEach(() => {
  mockCookies.clear();
  mockEmails.clear();
});

// Submissions, contributors and sessions all cascade from the users.
afterAll(async () => {
  await prisma.user.deleteMany({
    where: { userId: { in: [MUSICIAN_ID, STAFF_ID] } },
  });
});

const setStaffRole = (role: Role) =>
  prisma.user.update({ where: { userId: STAFF_ID }, data: { role } });

describe("update-music-submission", () => {
  test("An Admin can update someone else's song submission", async () => {
    await setStaffRole("ADMIN");
    await resetSubmission();
    mockCookies.set("sessionId", "update-music-session-staff");

    const response = await $api.updateMusicSubmission(updatedValues);

    expect(response.message).toEqual("Music submission updated successfully");

    const submission = await prisma.musicSubmission.findUnique({
      where: { musicId: MUSIC_ID },
      include: { contributors: true },
    });

    expect(submission?.songName).toEqual("Corrected Song");
    expect(submission?.songLink).toEqual("https://example.com/corrected");
    expect(submission?.genres).toEqual([Genre.JAZZ]);
    expect(submission?.additionalInfo).toEqual("Corrected info");
    expect(submission?.songLyrics).toEqual("Corrected lyrics");
    expect(submission?.performerName).toEqual("Corrected Artist");
    // The song still belongs to the musician who submitted it.
    expect(submission?.submitterId).toEqual(MUSICIAN_ID);
  });

  test("Contributors are replaced rather than duplicated", async () => {
    await setStaffRole("ADMIN");
    await resetSubmission();
    mockCookies.set("sessionId", "update-music-session-staff");

    await $api.updateMusicSubmission(updatedValues);

    const contributors = await prisma.musicContributor.findMany({
      where: { musicSubmissionId: MUSIC_ID },
    });

    expect(contributors).toHaveLength(2);
    expect(
      contributors.find((contributor) => contributor.lastName === "Contributor")
        ?.firstName,
    ).toEqual("New");

    // The submitter row is rebuilt from the submitter fields, still flagged and
    // still named after the musician rather than the admin doing the editing.
    const submitter = contributors.find(
      (contributor) => contributor.isSubmitter,
    );
    expect(submitter?.roles).toEqual([MusicRole.LYRICIST]);
    expect(submitter?.affiliation).toEqual(MusicAffiliation.BMI);
    expect(submitter?.ipi).toEqual("2222");
    expect(submitter?.email).toEqual(`${MUSICIAN_ID}@prisma.io`);
  });

  test("Updating does not touch the musician's saved profile", async () => {
    await setStaffRole("ADMIN");
    await resetSubmission();
    await prisma.user.update({
      where: { userId: MUSICIAN_ID },
      data: { ipi: "9999", affiliation: MusicAffiliation.ASCAP },
    });
    mockCookies.set("sessionId", "update-music-session-staff");

    await $api.updateMusicSubmission(updatedValues);

    const musician = await prisma.user.findUnique({
      where: { userId: MUSICIAN_ID },
      select: { ipi: true, affiliation: true },
    });

    expect(musician?.ipi).toEqual("9999");
    expect(musician?.affiliation).toEqual(MusicAffiliation.ASCAP);
  });

  test("A Moderator can update a song submission", async () => {
    await setStaffRole("MODERATOR");
    await resetSubmission();
    mockCookies.set("sessionId", "update-music-session-staff");

    const response = await $api.updateMusicSubmission(updatedValues);

    expect(response.message).toEqual("Music submission updated successfully");
  });

  test("A Musician cannot update a song submission", async () => {
    await resetSubmission();
    mockCookies.set("sessionId", "update-music-session-musician");

    expect($api.updateMusicSubmission(updatedValues)).rejects.toThrow(
      "permission to modify",
    );
  });

  test("A Media Maker cannot update a song submission", async () => {
    await setStaffRole("MEDIA_MAKER");
    await resetSubmission();
    mockCookies.set("sessionId", "update-music-session-staff");

    expect($api.updateMusicSubmission(updatedValues)).rejects.toThrow(
      "permission to modify",
    );
  });

  test("Updating a song that does not exist is a not found error", async () => {
    await setStaffRole("ADMIN");
    mockCookies.set("sessionId", "update-music-session-staff");

    expect(
      $api.updateMusicSubmission({
        ...updatedValues,
        musicId: "does-not-exist",
      }),
    ).rejects.toThrow("Music submission ID was not found.");
  });
});
