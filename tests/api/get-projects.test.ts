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
      prisma.user.create({
        data: {
          userId: "anzhuo-mediamaker-id",
          email: "anzhuo@test.org",
          phoneNumber: "8889990000",
          hashedPassword: "xxxx",
          firstName: "Anzhuo",
          lastName: "Wang",
          role: "MEDIA_MAKER",
          sessions: {
            create: {
              sessionId: "anzhuo-session-id",
              expiresAt: new Date(Date.now() + 600_000),
            },
          },
        },
      }),
      prisma.projectSubmission.create({
        data: {
          projectTitle: "Project 1",
          projectId: "anzhuo-project-1",
          projectOwnerId: "anzhuo-mediamaker-id",
          description: "Project 1",
          deadline: new Date(Date.now() + 600_000),
        },
      }),
      prisma.projectSubmission.create({
        data: {
          projectTitle: "Project 2",
          projectId: "anzhuo-project-2",
          projectOwnerId: "anzhuo-mediamaker-id",
          description: "Project 2",
          deadline: new Date(Date.now() + 600_000),
        },
      }),
      prisma.user.create({
        data: {
          userId: "anzhuo-musician-id",
          email: "anzhuo-musician@test.org",
          phoneNumber: "8889990000",
          hashedPassword: "xxxx",
          firstName: "Anzhuo",
          lastName: "Wang",
          role: "MUSICIAN",
          sessions: {
            create: {
              sessionId: "anzhuo-session-musician-id",
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
    await prisma.songRequest.deleteMany({
      where: {
        songRequestId: {
          in: ["test-song-request-1"],
        },
      },
    });

    await prisma.projectSubmission.deleteMany({
      where: {
        projectId: {
          in: [
            "project-id-1",
            "project-id-2",
            "project-id-3",
            "anzhuo-project-1",
            "anzhuo-project-2",
          ],
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
            "anzhuo-mediamaker-id",
            "anzhuo-musician-id",
          ],
        },
      },
    });
  });

  // All projects [admin/moderator]
  test("Correct projects are returned when they have an ADMIN session.", async () => {
    cookies.set("sessionId", "owen-session-id");
    const { projects } = await $api.projects();

    expect(projects).not.toBeNull();
    expect(projects.length).toBeGreaterThanOrEqual(3);
    projects.forEach((p) => {
      expect(p.projectId).toBeOneOf([
        "project-id-1",
        "project-id-2",
        "project-id-3",
        "anzhuo-project-1",
        "anzhuo-project-2",
      ]);
    });
  });

  test("Correct projects are returned when they have a MODERATOR session.", async () => {
    cookies.set("sessionId", "gavin-session-id");
    const { projects } = await $api.projects();

    expect(projects).not.toBeNull();
    expect(projects.length).toBeGreaterThanOrEqual(3);
    projects.forEach((p) => {
      expect(p.projectId).toBeOneOf([
        "project-id-1",
        "project-id-2",
        "project-id-3",
        "anzhuo-project-1",
        "anzhuo-project-2",
      ]);
    });
  });

  test("No projects are returned when they have a NON MODERATOR OR ADMIN session.", () => {
    cookies.set("sessionId", "amoli-session-id");
    expect($api.projects()).rejects.toThrow("permission to read");
  });

  // User-specific projects [media maker]
  test("Correct projects are returned for a specific user when they have a MEDIA_MAKER session.", async () => {
    cookies.set("sessionId", "anzhuo-session-id");
    const { projects } = await $api.userProjects();

    expect(projects).not.toBeNull();
    expect(projects).toHaveLength(2);

    projects.forEach((p) => {
      expect(p.projectOwnerId).toBe("anzhuo-mediamaker-id");
      expect(p.projectId).toBeOneOf(["anzhuo-project-1", "anzhuo-project-2"]);
    });
  });

  test("Correct projects are returned for a specific user when they have a MEDIA_MAKER session.", async () => {
    cookies.set("sessionId", "amoli-session-id");
    const { projects } = await $api.userProjects();

    expect(projects).not.toBeNull();
    expect(projects).toHaveLength(0);
  });

  test("No projects are returned for a specific user when they have a NON MEDIA_MAKER session.", () => {
    cookies.set("sessionId", "anzhuo-session-musician-id");
    expect($api.userProjects()).rejects.toThrow(
      "You do not have permission to read this resource.",
    );
  });

  test("No projects are returned when a user is unauthenticated.", () => {
    expect($api.userProjects()).rejects.toThrow("UNAUTHORIZED");
  });
});
