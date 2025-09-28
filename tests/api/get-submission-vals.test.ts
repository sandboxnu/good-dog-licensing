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
import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

async function createData() {
  const musician = await prisma.user.create({
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
  const submission1 = await prisma.musicSubmission.create({
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
            name: "Jordan Praissman",
            roles: ["PRODUCER"],
            affiliation: "ASCAP",
            ipi: "1234",
            isSubmitter: true,
          },
          {
            contributorId: "contributor-id-1",
            name: "Wesley Tran",
            roles: ["SONGWRITER", "INSTRUMENTALIST"],
            affiliation: "NONE",
            ipi: "",
          },
          {
            contributorId: "contributor-id-3",
            name: "Humpty Dumpty",
            roles: ["LYRICIST"],
            affiliation: "BMI",
          },
        ],
      },
      performerName: "Humpty Dumpty",
      songLink: "www.felloffthewall.com",
      genre: "rock",
    },
  });
  const submission2 = await prisma.musicSubmission.create({
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
            contributorId: "contributor-id-2",
            name: "Jordan Praissman",
            roles: ["PRODUCER"],
            affiliation: "ASCAP",
            ipi: "1234",
            isSubmitter: true,
          },
          {
            contributorId: "contributor-id-1",
            name: "Wesley Tran",
            roles: ["SONGWRITER", "INSTRUMENTALIST"],
            affiliation: "NONE",
            ipi: "1234",
          },
          {
            contributorId: "contributor-id-3",
            name: "Humpty Dumpty",
            roles: ["LYRICIST", "VOCALIST"],
            affiliation: "BMI",
          },
        ],
      },
      performerName: "Humpty Dumpty",
      songLink: "www.felloffthewall.com",
      genre: "rock",
    },
  });
}

describe("get-submission-vals", () => {
  const cookies = new MockNextCookies();

  beforeAll(async () => {
    await createData();
  });

  afterAll(async () => {
    await prisma.musicSubmission.deleteMany({
      where: {
        musicId: {
          in: ["music-id-1", "music-id-2"],
        },
      },
    });
    await prisma.user.deleteMany({
      where: {
        userId: {
          in: ["jp-musician-id"],
        },
      },
    });
  });

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(cookies),
    prisma: prisma,
  });

  test("Correct list of contributors is returned when called for", async () => {
    cookies.set("sessionId", "jp-session-id");
    const contributors = await $api.getMusicSubmissionPrefillVals();

    const expectedResult = {
      contributors: [
        {
          name: "Wesley Tran",
          roles: ["SONGWRITER", "INSTRUMENTALIST"],
          ipi: "1234",
          affiliation: "NONE",
        },
        {
          name: "Humpty Dumpty",
          roles: ["LYRICIST"],
          ipi: "",
          affiliation: "BMI",
        },
        {
          name: "Humpty Dumpty",
          roles: ["LYRICIST", "VOCALIST"],
          ipi: "",
          affiliation: "BMI",
        },
      ],
      userAffiliation: "ASCAP",
      userIpi: "",
    };

    expect(contributors).toEqual(expectedResult);
  });
});
