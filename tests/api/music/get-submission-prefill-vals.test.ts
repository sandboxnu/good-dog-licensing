import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { Genre, MusicAffiliation, prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../../mocks/MockNextCookies";
import { createMockCookieService } from "../../mocks/util";

async function createData() {
  await prisma.user.create({
    data: {
      userId: "jp-musician-id",
      email: "jp@test.org",
      phoneNumber: "0987654321",
      hashedPassword: "yyyy",
      firstName: "Jordan",
      lastName: "Praissman",
      role: "MUSICIAN",
      sessions: {
        create: {
          sessionId: "jp-session-id",
          expiresAt: new Date(Date.now() + 600_000),
        },
      },
      affiliation: "ASCAP",
    },
  });
  await prisma.musicSubmission.create({
    data: {
      musicId: "music-id-1",
      songName: "song-name-1",
      submitter: {
        connect: {
          userId: "jp-musician-id",
        },
      },
      contributors: {
        create: [
          {
            contributorId: "contributor-id-2",
            firstName: "Jordan",
            lastName: "Praissman",
            roles: ["PRODUCER"],
            affiliation: "ASCAP",
            ipi: "1234",
            isSubmitter: true,
          },
          {
            contributorId: "contributor-id-1",
            firstName: "Wesley",
            lastName: "Tran",
            roles: ["SONGWRITER", "INSTRUMENTALIST"],
            affiliation: "NONE",
          },
          {
            contributorId: "contributor-id-3",
            firstName: "Humpty",
            lastName: "Dumpty",
            roles: ["LYRICIST"],
            affiliation: "BMI",
          },
        ],
      },
      performerName: "Humpty Dumpty",
      songLink: "www.felloffthewall.com",
      genres: [Genre.ROCK],
      songLyrics: "",
    },
  });
}

async function createMoreData() {
  await prisma.musicSubmission.create({
    data: {
      musicId: "music-id-2",
      songName: "song-name-2",
      submitter: {
        connect: {
          userId: "jp-musician-id",
        },
      },
      contributors: {
        create: [
          {
            contributorId: "contributor-id-5",
            firstName: "Jordan",
            lastName: "Praissman",
            roles: ["PRODUCER"],
            affiliation: "ASCAP",
            ipi: "1234",
            isSubmitter: true,
          },
          {
            contributorId: "contributor-id-4",
            firstName: "Wesley",
            lastName: "Tran",
            roles: ["SONGWRITER", "INSTRUMENTALIST"],
            affiliation: "NONE",
            ipi: "1234",
          },
          {
            contributorId: "contributor-id-6",
            firstName: "Humpty",
            lastName: "Dumpty",
            roles: ["LYRICIST", "VOCALIST"],
            affiliation: "BMI",
          },
          {
            contributorId: "contributor-id-7",
            firstName: "Fighter",
            lastName: "Jet",
            roles: ["INSTRUMENTALIST"],
            affiliation: "ASCAP",
          },
        ],
      },
      performerName: "Humpty Dumpty",
      songLink: "www.felloffthewall.com",
      genres: [Genre.ROCK],
      songLyrics: "",
    },
  });
}

describe("get-submission-vals", () => {
  const cookies = new MockNextCookies();

  beforeAll(async () => {
    await createData();
  });

  afterAll(async () => {
    await prisma.musicContributor.deleteMany({
      where: {
        contributorId: {
          in: ["contributor-id-1", "contributor-id-2", "contributor-id-3"],
        },
      },
    });

    await prisma.musicSubmission.deleteMany({
      where: {
        musicId: {
          in: ["music-id-1", "music-id-2"],
        },
      },
    });

    await prisma.session.deleteMany({
      where: {
        sessionId: "jp-session-id",
      },
    });

    await prisma.user.deleteMany({
      where: {
        userId: "jp-musician-id",
      },
    });
  });

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(cookies),
    prisma: prisma,
  });

  test("Correct list of contributors from single music submission", async () => {
    cookies.set("sessionId", "jp-session-id");
    const contributors = await $api.getMusicSubmissionPrefillVals();

    const expectedResult = {
      contributors: [
        {
          firstName: "Humpty",
          lastName: "Dumpty",
          email: null,
          affiliation: MusicAffiliation.BMI,
          otherAffiliationName: null,
          ipi: null,
          publisher: null,
          publisherIpi: null,
        },
        {
          firstName: "Wesley",
          lastName: "Tran",
          email: null,
          ipi: null,
          affiliation: MusicAffiliation.NONE,
          otherAffiliationName: null,
          publisher: null,
          publisherIpi: null,
        },
      ],
      userAffiliation: MusicAffiliation.ASCAP,
      userOtherAffiliationName: null,
      userIpi: null,
      userPublisher: null,
      userPublisherIpi: null,
    };

    expect(contributors).toEqual(expectedResult);
  });

  test("Correct contribs after replacing ipi user & adding user with same vals, but diff roles.", async () => {
    cookies.set("sessionId", "jp-session-id");
    await createMoreData();
    const contributors = await $api.getMusicSubmissionPrefillVals();

    const expectedResult = {
      contributors: [
        {
          firstName: "Fighter",
          lastName: "Jet",
          email: null,
          affiliation: MusicAffiliation.ASCAP,
          otherAffiliationName: null,
          ipi: null,
          publisher: null,
          publisherIpi: null,
        },
        {
          firstName: "Humpty",
          lastName: "Dumpty",
          email: null,
          affiliation: MusicAffiliation.BMI,
          otherAffiliationName: null,
          ipi: null,
          publisher: null,
          publisherIpi: null,
        },
        {
          firstName: "Wesley",
          lastName: "Tran",
          email: null,
          ipi: "1234",
          affiliation: MusicAffiliation.NONE,
          otherAffiliationName: null,
          publisher: null,
          publisherIpi: null,
        },
      ],
      userAffiliation: MusicAffiliation.ASCAP,
      userOtherAffiliationName: null,
      userIpi: null,
      userPublisher: null,
      userPublisherIpi: null,
    };

    expect(contributors).toEqual(expectedResult);
  });

  test("OTHER affiliation round-trips with its free-text PRO name", async () => {
    cookies.set("sessionId", "jp-session-id");

    await prisma.user.update({
      where: { userId: "jp-musician-id" },
      data: {
        affiliation: "OTHER",
        otherAffiliationName: "SoundExchange",
      },
    });

    await prisma.musicContributor.create({
      data: {
        contributorId: "contributor-id-other",
        firstName: "Other",
        lastName: "Contributor",
        roles: ["SONGWRITER"],
        affiliation: "OTHER",
        otherAffiliationName: "GMR",
        ipi: "4242",
        MusicSubmission: { connect: { musicId: "music-id-1" } },
      },
    });

    const contributors = await $api.getMusicSubmissionPrefillVals();

    expect(contributors.userAffiliation).toBe(MusicAffiliation.OTHER);
    expect(contributors.userOtherAffiliationName).toBe("SoundExchange");

    const otherContributor = contributors.contributors.find(
      (c) => c.firstName === "Other" && c.lastName === "Contributor",
    );
    expect(otherContributor?.affiliation).toBe(MusicAffiliation.OTHER);
    expect(otherContributor?.otherAffiliationName).toBe("GMR");
    expect(otherContributor?.ipi).toBe("4242");

    await prisma.musicContributor.delete({
      where: { contributorId: "contributor-id-other" },
    });
  });
});
