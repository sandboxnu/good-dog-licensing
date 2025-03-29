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

describe("projectSubmission", () => {
  const mockCookies = new MockNextCookies();

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(mockCookies),
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
      scenes: [
        {
          sceneTitle: "Scene 1",
          description: "Scene 1 description",
          musicType: "Classical",
          similarSongs: "Song A, Song B",
          additionalInfo: "Some additional info",
        },
        {
          sceneTitle: "Scene 2",
          description: "Scene 2 description",
          musicType: "Indie",
        },
      ],
      deadline: new Date().toISOString(),
      videoLink: "https://test.com/video",
      additionalInfo: "General additional info",
    };

    const response = await $api.projectSubmission(input);
    expect(response).toEqual({
      message: "Project submission created successfully",
    });

    const storedProject = await prisma.projectSubmission.findFirst({
      where: { projectOwner: { userId: "damian-user-id" } },
      include: { scenes: true },
    });

    // Ensure the project was inserted
    expect(storedProject).not.toBeNull();
    if (!storedProject)
      throw new Error("Project submission not found in database");

    // Validate project fields
    expect(storedProject.projectTitle).toBe(input.projectTitle);
    expect(storedProject.description).toBe(input.description);
    expect(storedProject.deadline.toISOString()).toBe(input.deadline);
    expect(storedProject.videoLink).toBe(input.videoLink);
    expect(storedProject.additionalInfo).toBe(input.additionalInfo);

    // Validate scene data
    expect(storedProject.scenes.length).toBe(2);

    expect(storedProject.scenes[0]?.sceneTitle).toBe("Scene 1");
    expect(storedProject.scenes[0]?.description).toBe("Scene 1 description");
    expect(storedProject.scenes[0]?.musicType).toBe("Classical");
    expect(storedProject.scenes[0]?.similarSongs).toBe("Song A, Song B");
    expect(storedProject.scenes[0]?.additionalInfo).toBe(
      "Some additional info",
    );

    expect(storedProject.scenes[1]?.sceneTitle).toBe("Scene 2");
    expect(storedProject.scenes[1]?.description).toBe("Scene 2 description");
    expect(storedProject.scenes[1]?.musicType).toBe("Indie");

    // Delete scenes
    await prisma.sceneSubmission.deleteMany({
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
      scenes: [],
      deadline: new Date().toISOString(),
      videoLink: "https://test.com/video",
      additionalInfo: "General additional info",
    };

    expect($api.projectSubmission(input)).rejects.toThrow(
      "Only media makers can submit projects.",
    );
  });
});
