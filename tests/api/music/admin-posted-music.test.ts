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

const mockCookies = new MockNextCookies();
const mockEmails = new MockEmailService();

const $api = $createTrpcCaller({
  cookiesService: createMockCookieService(mockCookies),
  emailService: mockEmails,
  prisma: prisma,
});

const ADMIN_ID = "apm-admin";
const MODERATOR_ID = "apm-moderator";
const MUSICIAN_ID = "apm-musician";
const OTHER_MUSICIAN_ID = "apm-other-musician";
const MEDIA_MAKER_ID = "apm-media-maker";

const sessionFor = (userId: string) => `${userId}-session`;

const users = [
  { userId: ADMIN_ID, role: "ADMIN", email: "apm-admin@test.com" },
  { userId: MODERATOR_ID, role: "MODERATOR", email: "apm-mod@test.com" },
  { userId: MUSICIAN_ID, role: "MUSICIAN", email: "apm-musician@test.com" },
  {
    userId: OTHER_MUSICIAN_ID,
    role: "MUSICIAN",
    email: "apm-other@test.com",
  },
  { userId: MEDIA_MAKER_ID, role: "MEDIA_MAKER", email: "apm-mm@test.com" },
] as const;

const songValues = {
  songName: "Admin Posted Song",
  songLink: "https://example.com/admin-posted",
  genres: [Genre.FOLK],
  additionalInfo: "Posted by an admin",
  songLyrics: "La la la",
  performerName: "The Posted Band",
  contributors: [
    {
      firstName: "Helper",
      lastName: "Person",
      roles: [MusicRole.PRODUCER],
    },
  ],
  submitterRoles: [MusicRole.SONGWRITER],
  submitterAffiliation: MusicAffiliation.BMI,
  submitterIpi: "999",
};

/** Awaits `promise` and asserts it rejected with a message containing `message`. */
async function expectRejection(promise: Promise<unknown>, message: string) {
  const error = await promise.then(
    () => null,
    (e: unknown) => e,
  );
  expect(error).toBeInstanceOf(Error);
  expect((error as Error).message).toContain(message);
}

const loginAs = (userId: string) =>
  mockCookies.set("sessionId", sessionFor(userId));

const postSongAsAdmin = async (songName = songValues.songName) => {
  loginAs(ADMIN_ID);
  const { musicSubmission } = await $api.adminSubmitMusicForMusician({
    musicianId: MUSICIAN_ID,
    submission: { ...songValues, songName },
  });
  mockEmails.clear();
  return musicSubmission.musicId;
};

beforeAll(async () => {
  for (const user of users) {
    await prisma.user.create({
      data: {
        userId: user.userId,
        email: user.email,
        firstName: user.userId,
        lastName: "Tester",
        role: user.role,
        hashedPassword: "password",
        phoneNumber: "1234567890",
        sessions: {
          create: {
            sessionId: sessionFor(user.userId),
            expiresAt: new Date(Date.now() + 5_000_000_000),
          },
        },
      },
    });
  }
});

afterEach(async () => {
  mockCookies.clear();
  mockEmails.clear();
  await prisma.musicSubmission.deleteMany({
    where: { submitterId: { in: [MUSICIAN_ID, OTHER_MUSICIAN_ID] } },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { userId: { in: users.map((u) => u.userId) } },
  });
});

describe("admin posting music for a musician", () => {
  test("creates the song as the musician, waiting for their review", async () => {
    loginAs(ADMIN_ID);

    const response = await $api.adminSubmitMusicForMusician({
      musicianId: MUSICIAN_ID,
      submission: songValues,
    });

    expect(response.message).toEqual("Song posted for musician review");

    const submission = await prisma.musicSubmission.findUnique({
      where: { musicId: response.musicSubmission.musicId },
      include: { contributors: true },
    });

    expect(submission?.submitterId).toEqual(MUSICIAN_ID);
    expect(submission?.postedByAdminId).toEqual(ADMIN_ID);
    expect(submission?.approvalStatus).toEqual("WAITING_FOR_MUSICIAN_REVIEW");
    expect(submission?.songName).toEqual(songValues.songName);

    const submitter = submission?.contributors.find((c) => c.isSubmitter);
    expect(submitter?.firstName).toEqual(MUSICIAN_ID);
    expect(submitter?.email).toEqual("apm-musician@test.com");
    expect(submitter?.roles).toEqual([MusicRole.SONGWRITER]);
    expect(submitter?.ipi).toEqual("999");
    expect(submission?.contributors).toHaveLength(2);

    // The musician's profile isn't touched until they approve
    const musician = await prisma.user.findUnique({
      where: { userId: MUSICIAN_ID },
    });
    expect(musician?.ipi).toBeNull();

    // The musician is emailed a link to review it
    expect(mockEmails.send).toHaveBeenCalledTimes(1);
    expect(mockEmails.send.mock.calls[0]?.[0].to).toEqual([
      "apm-musician@test.com",
    ]);
    expect(mockEmails.send.mock.calls[0]?.[0].html).toContain(
      `/song/${response.musicSubmission.musicId}/review`,
    );
  });

  test("pending songs are hidden from the song list and shown as pending", async () => {
    const musicId = await postSongAsAdmin();

    loginAs(ADMIN_ID);
    const allMusic = await $api.allMusic();
    expect(allMusic.some((song) => song.musicId === musicId)).toBe(false);

    const pending = await $api.pendingMusicForMusicians();
    const pendingSong = pending.find((song) => song.musicId === musicId);
    expect(pendingSong?.submitter.firstName).toEqual(MUSICIAN_ID);
    expect(pendingSong?.postedByAdmin?.firstName).toEqual(ADMIN_ID);

    loginAs(MUSICIAN_ID);
    const { music } = await $api.userMusic();
    expect(music.find((song) => song.musicId === musicId)?.approvalStatus).toBe(
      "WAITING_FOR_MUSICIAN_REVIEW",
    );
  });

  test("only admins can post songs for musicians", async () => {
    for (const userId of [MODERATOR_ID, MUSICIAN_ID, MEDIA_MAKER_ID]) {
      loginAs(userId);
      await expectRejection(
        $api.adminSubmitMusicForMusician({
          musicianId: MUSICIAN_ID,
          submission: songValues,
        }),
        "You do not have permission",
      );
      await expectRejection(
        $api.pendingMusicForMusicians(),
        "You do not have permission",
      );
      await expectRejection($api.musicians(), "You do not have permission");
    }
  });

  test("songs can only be posted for musician accounts", async () => {
    loginAs(ADMIN_ID);
    await expectRejection(
      $api.adminSubmitMusicForMusician({
        musicianId: MEDIA_MAKER_ID,
        submission: songValues,
      }),
      "Musician not found.",
    );
  });

  test("musicians lists only musicians", async () => {
    loginAs(ADMIN_ID);
    const musicians = await $api.musicians();
    const ids = musicians.map((m) => m.userId);
    expect(ids).toContain(MUSICIAN_ID);
    expect(ids).toContain(OTHER_MUSICIAN_ID);
    expect(ids).not.toContain(ADMIN_ID);
    expect(ids).not.toContain(MEDIA_MAKER_ID);
  });

  test("admins get the chosen musician's prefill values; musicians can't", async () => {
    await prisma.user.update({
      where: { userId: MUSICIAN_ID },
      data: { ipi: "prefill-ipi" },
    });

    loginAs(ADMIN_ID);
    const prefill = await $api.getMusicSubmissionPrefillVals({
      musicianId: MUSICIAN_ID,
    });
    expect(prefill.userIpi).toEqual("prefill-ipi");

    loginAs(OTHER_MUSICIAN_ID);
    await expectRejection(
      $api.getMusicSubmissionPrefillVals({ musicianId: MUSICIAN_ID }),
      "Only admins",
    );

    await prisma.user.update({
      where: { userId: MUSICIAN_ID },
      data: { ipi: null },
    });
  });
});

describe("musician reviewing a posted song", () => {
  test("the musician can load their pending song; nobody else can", async () => {
    const musicId = await postSongAsAdmin();

    loginAs(MUSICIAN_ID);
    const review = await $api.pendingMusicSubmissionForReview({ musicId });
    expect(review.songName).toEqual(songValues.songName);
    expect(review.contributors).toHaveLength(2);

    loginAs(OTHER_MUSICIAN_ID);
    await expectRejection(
      $api.pendingMusicSubmissionForReview({ musicId }),
      "Song not found.",
    );
  });

  test("approving saves the musician's edits and makes the song matchable", async () => {
    const musicId = await postSongAsAdmin();

    loginAs(MUSICIAN_ID);
    const response = await $api.approvePendingMusicSubmission({
      musicId,
      submission: {
        ...songValues,
        songName: "Edited Song Name",
        contributors: [],
        submitterIpi: "123-edited",
      },
    });
    expect(response.message).toEqual("Song approved");

    const submission = await prisma.musicSubmission.findUnique({
      where: { musicId },
      include: { contributors: true },
    });
    expect(submission?.approvalStatus).toEqual("APPROVED");
    expect(submission?.songName).toEqual("Edited Song Name");
    expect(submission?.postedByAdminId).toEqual(ADMIN_ID);
    // Contributors are replaced with the musician's edited list
    expect(submission?.contributors).toHaveLength(1);
    expect(submission?.contributors[0]?.isSubmitter).toBe(true);
    expect(submission?.contributors[0]?.ipi).toEqual("123-edited");

    // Profile is updated just like a normal submission
    const musician = await prisma.user.findUnique({
      where: { userId: MUSICIAN_ID },
    });
    expect(musician?.ipi).toEqual("123-edited");

    // Musician gets the usual confirmation; the posting admin is notified
    expect(mockEmails.send).toHaveBeenCalledTimes(2);
    const recipients = mockEmails.send.mock.calls.map((call) => call[0].to);
    expect(recipients).toContainEqual(["apm-musician@test.com"]);
    expect(recipients).toContainEqual(["apm-admin@test.com"]);

    loginAs(ADMIN_ID);
    const allMusic = await $api.allMusic();
    expect(allMusic.some((song) => song.musicId === musicId)).toBe(true);

    // Can't be reviewed twice
    loginAs(MUSICIAN_ID);
    await expectRejection(
      $api.approvePendingMusicSubmission({ musicId, submission: songValues }),
      "already been reviewed",
    );

    await prisma.user.update({
      where: { userId: MUSICIAN_ID },
      data: { ipi: null, affiliation: null },
    });
  });

  test("declining deletes the song and notifies the posting admin", async () => {
    const musicId = await postSongAsAdmin();

    loginAs(MUSICIAN_ID);
    const response = await $api.declinePendingMusicSubmission({ musicId });
    expect(response.message).toEqual("Song declined");

    const submission = await prisma.musicSubmission.findUnique({
      where: { musicId },
    });
    expect(submission).toBeNull();

    expect(mockEmails.send).toHaveBeenCalledTimes(1);
    expect(mockEmails.send.mock.calls[0]?.[0].to).toEqual([
      "apm-admin@test.com",
    ]);
    expect(mockEmails.send.mock.calls[0]?.[0].html).toContain("declined");
  });

  test("another musician can't approve or decline someone else's song", async () => {
    const musicId = await postSongAsAdmin();

    loginAs(OTHER_MUSICIAN_ID);
    await expectRejection(
      $api.approvePendingMusicSubmission({ musicId, submission: songValues }),
      "Song not found.",
    );
    await expectRejection(
      $api.declinePendingMusicSubmission({ musicId }),
      "Song not found.",
    );
  });

  test("songs a musician submits themselves can't be 'reviewed'", async () => {
    loginAs(MUSICIAN_ID);
    const { musicSubmission } = await $api.submitMusic(songValues);

    const stored = await prisma.musicSubmission.findUnique({
      where: { musicId: musicSubmission.musicId },
    });
    expect(stored?.approvalStatus).toEqual("APPROVED");

    await expectRejection(
      $api.declinePendingMusicSubmission({ musicId: musicSubmission.musicId }),
      "already been reviewed",
    );

    await prisma.user.update({
      where: { userId: MUSICIAN_ID },
      data: { ipi: null, affiliation: null },
    });
  });
});
