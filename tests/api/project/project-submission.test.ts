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
            email: "meggan@test.org",
          },
        ],
      },
    });
  });

  test("create a project submission", async () => {
    mockCookies.set("sessionId", "damian-session-id");

    const input = {
      projectTitle: "Test Project",
      description: "A test project for submission",
      songRequests: [
        {
          songRequestTitle: "Epic Adventure",
          description: "SongRequest 1 description",
          feelingsConveyed: "Classical",
          similarSongs: "Song A, Song B",
          additionalInfo: "Some additional info",
        },
        {
          songRequestTitle: "Chill Vibes",
          description: "SongRequest 2 description",
          feelingsConveyed: "Indie",
          similarSongs: "Cool Song",
        },
      ],
      deadline: new Date(),
      videoLink: "https://test.com/video",
      additionalInfo: "General additional info",
      projectType: ProjectType.MOTION_PICTURE,
    };

    const response = await $api.projectSubmission(input);
    expect(response).toEqual({
      message: "Project submission created successfully",
    });

    const storedProject = await prisma.projectSubmission.findFirst({
      where: { projectOwner: { userId: "damian-user-id" } },
      include: { songRequests: true },
    });

    // Ensure the project was inserted
    expect(storedProject).not.toBeNull();
    if (!storedProject)
      throw new Error("Project submission not found in database");

    // Validate project fields
    expect(storedProject.projectTitle).toBe(input.projectTitle);
    expect(storedProject.description).toBe(input.description);
    expect(storedProject.deadline.toISOString()).toBe(
      input.deadline.toISOString(),
    );
    expect(storedProject.videoLink).toBe(input.videoLink);
    expect(storedProject.additionalInfo).toBe(input.additionalInfo);

    // Validate song request data
    expect(storedProject.songRequests.length).toBe(2);

    expect(storedProject.songRequests[0]?.description).toBe(
      "SongRequest 1 description",
    );
    expect(storedProject.songRequests[0]?.songRequestTitle).toBe("Epic Adventure");
    expect(storedProject.songRequests[0]?.feelingsConveyed).toBe("Classical");
    expect(storedProject.songRequests[0]?.similarSongs).toBe("Song A, Song B");
    expect(storedProject.songRequests[0]?.additionalInfo).toBe(
      "Some additional info",
    );

    expect(storedProject.songRequests[1]?.description).toBe(
      "SongRequest 2 description",
    );
    expect(storedProject.songRequests[1]?.feelingsConveyed).toBe("Indie");
    expect(storedProject.songRequests[1]?.songRequestTitle).toBe("Chill Vibes");

    expect(mockEmailService.send).toBeCalled();

    // Delete songRequests
    await prisma.songRequest.deleteMany({
      where: {
        projectId: storedProject.projectId,
      },
    });

    // Delete projects
    await prisma.projectSubmission.delete({
      where: {
        projectId: storedProject.projectId,
      },
    });
  });

  test("create a project submission as a musician", () => {
    mockCookies.set("sessionId", "meggan-session-id");

    const input = {
      projectTitle: "Test Project",
      description: "A test project for submission",
      songRequests: [],
      deadline: new Date(),
      videoLink: "https://test.com/video",
      additionalInfo: "General additional info",
      projectType: ProjectType.SOCIAL_MEDIA_REEL,
    };

    expect($api.projectSubmission(input)).rejects.toThrow(
      "permission to submit",
    );

    expect(mockEmailService.send).not.toHaveBeenCalled();
  });
});
