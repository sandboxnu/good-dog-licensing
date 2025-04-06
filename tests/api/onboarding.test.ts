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

import { MockNextCache } from "../mocks/MockNextCache";
import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

describe("onboarding", () => {
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
          role: "ONBOARDING",
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
          userId: "tracy-user-id",
          email: "tracy@test.org",
          phoneNumber: "3456789012",
          hashedPassword: "xxxx",
          firstName: "Tracy",
          lastName: "Huang",
          role: "ONBOARDING",
          sessions: {
            create: {
              sessionId: "tracy-session-id",
              expiresAt: new Date(Date.now() + 5_000_000_000),
            },
          },
        },
      }),
      prisma.user.create({
        data: {
          userId: "isabelle-user-id",
          email: "isabelle@test.org",
          phoneNumber: "2345678901",
          hashedPassword: "xxxx",
          firstName: "Isabelle",
          lastName: "Papa",
          role: "MUSICIAN",
          sessions: {
            create: {
              sessionId: "isabelle-session-id",
              expiresAt: new Date(Date.now() + 5_000_000_000),
            },
          },
        },
      }),
      prisma.emailVerificationCode.createMany({
        data: [
          {
            email: "tracy@test.org",
            code: "019821",
            emailConfirmed: true,
            expiresAt: new Date(Date.now() + 60_000 * 100000),
          },
          {
            email: "owen@test.org",
            code: "777555",
            emailConfirmed: true,
            expiresAt: new Date(Date.now() + 60_000 * 100000),
          },
        ],
      }),
    ]);
  });

  const cookies = new MockNextCookies();
  const mockCache = new MockNextCache();

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(cookies),
    prisma: prisma,
  });

  beforeAll(async () => {
    await mockCache.apply();
  });

  afterEach(() => {
    cookies.clear();
    mockCache.clear();
  });

  // Delete the records created for these tests
  afterAll(async () => {
    await prisma.$transaction([
      prisma.user.deleteMany({
        where: {
          userId: {
            in: ["owen-user-id", "isabelle-user-id", "tracy-user-id"],
          },
        },
      }),
      prisma.musicianGroup.deleteMany({
        where: {
          name: "Owen's Group",
        },
      }),
      prisma.emailVerificationCode.deleteMany({
        where: {
          email: {
            in: ["owen@test.org", "tracy@test.org"],
          },
        },
      }),
    ]);
  });

  test("Throws FORBIDDEN error when user has already onboarded", () => {
    cookies.set("sessionId", "isabelle-session-id");

    expect(
      $api.onboarding({
        role: "MEDIA_MAKER",
        firstName: "Isabelle",
        lastName: "Papa",
      }),
    ).rejects.toThrow("User has already onboarded");
  });

  test("Onboards musician", async () => {
    cookies.set("sessionId", "owen-session-id");

    const response = await $api.onboarding({
      role: "MUSICIAN",
      firstName: "Owen",
      lastName: "Simpson",
      stageName: "Owen",
      isSongWriter: true,
      isAscapAffiliated: true,
      isBmiAffiliated: true,
      groupName: "Owen's Group",
      groupMembers: [
        {
          email: "damian@test.org",
          firstName: "Damian",
          lastName: "Uduevbo",
          isSongWriter: true,
          isAscapAffiliated: true,
        },
      ],
    });

    expect(response.message).toEqual("Successfully onboarded");
    expect(mockCache.revalidatePath).toHaveBeenCalledWith("/onboarding");

    const group = await prisma.musicianGroup.findFirst({
      where: {
        name: "Owen's Group",
      },
      include: {
        groupMembers: true,
      },
    });

    expect(group).not.toBeNull();
    expect(group?.groupMembers).toHaveLength(1);
    expect(group?.groupMembers[0]?.email).toEqual("damian@test.org");
  });

  test("Onboards media maker", async () => {
    cookies.set("sessionId", "tracy-session-id");

    const response = await $api.onboarding({
      role: "MEDIA_MAKER",
      firstName: "Tracy",
      lastName: "Huang",
    });

    expect(response.message).toEqual("Successfully onboarded");
    expect(mockCache.revalidatePath).toHaveBeenCalledWith("/onboarding");
  });
});
