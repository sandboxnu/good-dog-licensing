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

describe("get-projects", () => {
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
      prisma.projectSubmission.create({
        data: {
          projectId: "project-id-1",
          projectOwner: {
            create: {
              userId: "media-user-id-1",
              email: "media1@gmail.com",
              phoneNumber: "1234567890",
              hashedPassword: "xxxx",
              firstName: "Media",
              lastName: "User",
              role: "MEDIA_MAKER",
            },
          },
          projectTitle: "title",
          description: "description-1",
          deadline: new Date(Date.now() + 600_000),
        },
      }),
      prisma.projectSubmission.create({
        data: {
          projectId: "project-id-2",
          projectOwner: {
            create: {
              userId: "media-user-id-2",
              email: "media2@gmail.com",
              phoneNumber: "1234567890",
              hashedPassword: "xxxx",
              firstName: "Media",
              lastName: "User",
              role: "MEDIA_MAKER",
            },
          },
          projectTitle: "title",
          description: "description-2",
          deadline: new Date(Date.now() + 600_000),
        },
      }),
      prisma.projectSubmission.create({
        data: {
          projectId: "project-id-3",
          projectOwner: {
            create: {
              userId: "media-user-id-3",
              email: "media3@gmail.com",
              phoneNumber: "1234567890",
              hashedPassword: "xxxx",
              firstName: "Media",
              lastName: "User",
              role: "MEDIA_MAKER",
            },
          },
          projectTitle: "Another Project Title",
          description: "description-3",
          deadline: new Date(Date.now() + 600_000),
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
    await prisma.projectSubmission.deleteMany({
      where: {
        projectId: {
          in: ["project-id-1", "project-id-2", "project-id-3"],
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
            "media-user-id-1",
            "media-user-id-2",
            "media-user-id-3",
          ],
        },
      },
    });
  });

  test("Correct projects are returned when they have an ADMIN session.", async () => {
    cookies.set("sessionId", "owen-session-id");
    const { projects } = await $api.projects();

    expect(projects).not.toBeNull();
    projects.forEach((p) => {
      expect(p.projectId).toBeOneOf([
        "project-id-1",
        "project-id-2",
        "project-id-3",
      ]);
    });
  });

  test("Correct projects are returned when they have a MODERATOR session.", async () => {
    cookies.set("sessionId", "gavin-session-id");
    const { projects } = await $api.projects();

    expect(projects).not.toBeNull();
    projects.forEach((p) => {
      expect(p.projectId).toBeOneOf([
        "project-id-1",
        "project-id-2",
        "project-id-3",
      ]);
    });
  });

  test("No projects are returned when they have a NON MODERATOR OR ADMIN session.", () => {
    cookies.set("sessionId", "amoli-session-id");
    expect($api.projects()).rejects.toThrow("FORBIDDEN");
  });
});
