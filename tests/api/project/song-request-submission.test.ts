import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "bun:test";

import { prisma, ProjectType } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockEmailService } from "../../mocks/MockEmailService";
import { MockNextCookies } from "../../mocks/MockNextCookies";
import { createMockCookieService } from "../../mocks/util";

describe("projectSubmission", () => {
  const mockCookies = new MockNextCookies();
  const mockEmailService = new MockEmailService();

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(mockCookies),
    emailService: mockEmailService,
    prisma,
  });

  beforeAll(async () => {
    await prisma.$transaction([
      prisma.user.create({
        data: {
          userId: "damian-user-id",
          firstName: "Damian",
          lastName: "Smith",
          role: "MEDIA_MAKER",
          email: "damian@test.org",
          phoneNumber: "123-456-7890",
          hashedPassword: "password123",
          sessions: {
            create: {
              sessionId: "damian-session-id",
              expiresAt: new Date("2099-01-01"),
            },
          },
        },
      }),
      prisma.user.create({
        data: {
          firstName: "Gavin",
          lastName: "Normand",
          role: "MEDIA_MAKER",
          email: "gavin@test.org",
          phoneNumber: "123-456-7890",
          hashedPassword: "password123",
          sessions: {
            create: {
              sessionId: "gavin-session-id",
              expiresAt: new Date("2099-01-01"),
            },
          },
        },
      }),
      prisma.user.create({
        data: {
          firstName: "Meggan",
          lastName: "Shvartsberg",
          role: "MUSICIAN",
          email: "meggan@test.org",
          phoneNumber: "123-456-7890",
          hashedPassword: "password123",
          sessions: {
            create: {
              sessionId: "meggan-session-id",
              expiresAt: new Date("2099-01-01"),
            },
          },
        },
      }),
      prisma.projectSubmission.create({
        data: {
          projectId: "project-id-1",
          projectOwner: {
            connect: {
              userId: "damian-user-id",
            },
          },
          projectTitle: "title",
          description: "description-1",
          deadline: new Date(Date.now() + 600_000),
          projectType: ProjectType.MOTION_PICTURE,
        },
      }),
    ]);
  });

  afterEach(() => {
    mockCookies.clear();
    mockEmailService.clear();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        OR: [
          {
            email: "damian@test.org",
          },
          {
            email: "gavin@test.org",
          },
          {
            email: "meggan@test.org",
          },
        ],
      },
    });

    await prisma.projectSubmission.deleteMany({
      where: {
        projectId: "project-id-1",
      },
    });
  });

  test("create a song request submission", async () => {
    mockCookies.set("sessionId", "damian-session-id");

    const input = {
      projectId: "project-id-1",
      songRequest: {
        songRequestTitle: "Song Request 1",
        description: "SongRequest 1 description",
        feelingsConveyed: "Classical",
        similarSongs: "Song A, Song B",
        additionalInfo: "Some additional info",
      },
    };

    const projectBefore = await prisma.projectSubmission.findFirst({
      where: { projectId: "project-id-1" },
      include: { songRequests: true },
    });

    // Ensure the project exists
    expect(projectBefore).not.toBeNull();
    if (!projectBefore)
      throw new Error("Project submission not found in database");
    expect(projectBefore.songRequests.length).toBe(0);

    const response = await $api.songRequestSubmission(input);
    expect(response).toEqual({
      message: "Song request submission created successfully",
    });

    const projectAfter = await prisma.projectSubmission.findFirst({
      where: { projectId: "project-id-1" },
      include: { songRequests: true },
    });

    // Ensure the project exists
    expect(projectAfter).not.toBeNull();
    if (!projectAfter)
      throw new Error("Project submission not found in database");
    // Validate song request data
    expect(projectAfter.songRequests.length).toBe(1);

    expect(projectAfter.songRequests[0]?.description).toBe(
      "SongRequest 1 description",
    );
    expect(projectAfter.songRequests[0]?.feelingsConveyed).toBe("Classical");
    expect(projectAfter.songRequests[0]?.similarSongs).toBe("Song A, Song B");
    expect(projectAfter.songRequests[0]?.additionalInfo).toBe(
      "Some additional info",
    );

    // Delete songRequests
    await prisma.songRequest.deleteMany({
      where: {
        projectId: projectAfter.projectId,
      },
    });
  });

  test("create a song request submission as a musician", () => {
    mockCookies.set("sessionId", "meggan-session-id");

    const input = {
      projectId: "project-id-1",
      songRequest: {
        songRequestTitle: "Song Request 1",
        description: "SongRequest 1 description",
        feelingsConveyed: "Classical",
        similarSongs: "Song A, Song B",
        additionalInfo: "Some additional info",
      },
    };

    expect($api.songRequestSubmission(input)).rejects.toThrow(
      "permission to submit",
    );
  });

  test("create a song request submission as a media maker that doesn't own the project", () => {
    mockCookies.set("sessionId", "gavin-session-id");

    const input = {
      projectId: "project-id-1",
      songRequest: {
        songRequestTitle: "Song Request 1",
        description: "SongRequest 1 description",
        feelingsConveyed: "Classical",
        similarSongs: "Song A, Song B",
        additionalInfo: "Some additional info",
      },
    };

    expect($api.songRequestSubmission(input)).rejects.toThrow(
      "Project not found or you don't have permission",
    );
  });
});
