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
          description: "SongRequest 1 description",
          musicType: "Classical",
          similarSongs: "Song A, Song B",
          additionalInfo: "Some additional info",
          oneLineSummary: "First Song Request",
        },
        {
          description: "SongRequest 2 description",
          musicType: "Indie",
          oneLineSummary: "Second Song Request",
        },
      ],
      deadline: new Date(),
      videoLink: "https://test.com/video",
      additionalInfo: "General additional info",
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
    expect(storedProject.songRequests[0]?.musicType).toBe("Classical");
    expect(storedProject.songRequests[0]?.similarSongs).toBe("Song A, Song B");
    expect(storedProject.songRequests[0]?.additionalInfo).toBe(
      "Some additional info",
    );
    expect(storedProject.songRequests[0]?.oneLineSummary).toBe(
      "First Song Request",
    );

    expect(storedProject.songRequests[1]?.description).toBe(
      "SongRequest 2 description",
    );
    expect(storedProject.songRequests[1]?.musicType).toBe("Indie");
    expect(storedProject.songRequests[1]?.oneLineSummary).toBe(
      "Second Song Request",
    );

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
    };

    expect($api.projectSubmission(input)).rejects.toThrow(
      "permission to submit",
    );

    expect(mockEmailService.send).not.toHaveBeenCalled();
  });
});
