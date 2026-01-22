import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "bun:test";

import { passwordService } from "@good-dog/auth/password";
import { MusicAffiliation, prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

describe("change profile values", () => {
  beforeAll(async () => {
    await prisma.$transaction([
      prisma.user.create({
        data: {
          userId: "owen-user-id",
          email: "owen@test.org",
          phoneNumber: "1234567890",
          hashedPassword: "12345678A!",
          firstName: "Owen",
          lastName: "Simpson",
          role: "ADMIN",
          sessions: {
            create: {
              sessionId: "owen-session-id",
              expiresAt: new Date(Date.now() + 5_000_000_000),
            },
          },
          affiliation: MusicAffiliation.ASCAP,
          ipi: "has",
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
          role: "MEDIA_MAKER",
          sessions: {
            create: {
              sessionId: "gavin-session-id",
              expiresAt: new Date(Date.now() + 600_000),
            },
          },
          affiliation: MusicAffiliation.NONE,
        },
      }),
      prisma.user.create({
        data: {
          userId: "wesley-user-id",
          email: "wesley@test.org",
          phoneNumber: "6268221322",
          hashedPassword: "xxxx",
          firstName: "Wesley",
          lastName: "Tran",
          role: "MUSICIAN",
          sessions: {
            create: {
              sessionId: "wesley-session-id",
              expiresAt: new Date(Date.now() + 600_000),
            },
          },
          ipi: "wes",
        },
      }),
    ]);
  });

  const cookies = new MockNextCookies();

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(cookies),
    prisma: prisma,
    passwordService: passwordService,
  });

  afterEach(() => {
    cookies.clear();
  });

  // Delete the records created for these tests
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        userId: {
          in: ["owen-user-id", "wesley-user-id", "gavin-user-id"],
        },
      },
    });
  });

  test("User has to be logged in to change their own values", async () => {
    expect(
      $api.changeProfileValues({
        firstName: "testFirst",
        lastName: "testLast",
        affiliation: MusicAffiliation.ASCAP,
        ipi: "testets",
      }),
    ).rejects.toThrow("UNAUTHORIZED");
  });

  test("Change only first and last name", async () => {
    cookies.set("sessionId", "owen-session-id");

    const message = await $api.changeProfileValues({
      firstName: "NotOwen",
      lastName: "NotSimpson",
    });

    expect(message.message).toBe("Profile values updated.");
    const updatedUser = await prisma.user.findUnique({
      where: { userId: "owen-user-id" },
    });
    expect(updatedUser?.firstName).toBe("NotOwen");
    expect(updatedUser?.lastName).toBe("NotSimpson");
    expect(updatedUser?.affiliation).toBe(MusicAffiliation.ASCAP);
    expect(updatedUser?.ipi).toBe("has");
  });

  test("Changing firstName, lastName, and affiliation", async () => {
    cookies.set("sessionId", "gavin-session-id");

    const message = await $api.changeProfileValues({
      firstName: "NewGavin",
      lastName: "NewNormand",
      affiliation: MusicAffiliation.ASCAP,
    });

    expect(message.message).toBe("Profile values updated.");
    const updatedUser = await prisma.user.findUnique({
      where: { userId: "gavin-user-id" },
    });
    expect(updatedUser?.firstName).toBe("NewGavin");
    expect(updatedUser?.lastName).toBe("NewNormand");
    expect(updatedUser?.affiliation).toBe(MusicAffiliation.ASCAP);
    expect(updatedUser?.ipi).toBeNull();
  });

  test("Changing firstName, lastName, and ipi", async () => {
    cookies.set("sessionId", "wesley-session-id");

    const message = await $api.changeProfileValues({
      firstName: "NewWesley",
      lastName: "NewTran",
      ipi: "wowza",
    });

    expect(message.message).toBe("Profile values updated.");
    const updatedUser = await prisma.user.findUnique({
      where: { userId: "wesley-user-id" },
    });
    expect(updatedUser?.firstName).toBe("NewWesley");
    expect(updatedUser?.lastName).toBe("NewTran");
    expect(updatedUser?.affiliation).toBeNull();
    expect(updatedUser?.ipi).toBe("wowza");
  });

  test("Changing firstName, lastName + removing affiliation and ipi", async () => {
    cookies.set("sessionId", "owen-session-id");

    const message = await $api.changeProfileValues({
      firstName: "NewOwen",
      lastName: "NewSimpson",
      ipi: "",
    });

    expect(message.message).toBe("Profile values updated.");
    const updatedUser = await prisma.user.findUnique({
      where: { userId: "owen-user-id" },
    });
    expect(updatedUser?.firstName).toBe("NewOwen");
    expect(updatedUser?.lastName).toBe("NewSimpson");
    expect(updatedUser?.affiliation).toBeUndefined();
    expect(updatedUser?.ipi).toBeUndefined();
  });
});
