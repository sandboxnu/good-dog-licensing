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
  //create a mock user
  beforeAll(async () => {
    await prisma.$transaction([
      prisma.user.create({
        data: {
          userId: "meggan-user-id",
          email: "meggan@test.org",
          hashedPassword: "xxxx",
          firstName: "Meggan",
          lastName: "Shvartsberg",
          role: "ADMIN",
          sessions: {
            create: {
              sessionId: "meggan-session-id",
              expiresAt: new Date(Date.now() + 5_000_000_000),
            },
          },
        },
      }),
    ]);
  });
  const mockCookies = new MockNextCookies();
  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(mockCookies),
    prisma: prisma,
  });
  afterEach(() => {
    mockCookies.clear();
  });

  // Delete the records created for these tests
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        userId: {
          in: ["meggan-user-id"],
        },
      },
    });
  });

  test("create a project submission", async () => {
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
      where: { projectOwner: { userId: "meggan-user-id" } },
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
  });
});

//before all: create a user DONE
//make api request $api.endpoint
//pass in all the data fields for the project submission
//response = message
//expect to equal
//prisma quer to get data that u just inserted
//check that data to make sure it matches (testing sideffect)
//check that the fields were correct
// ?? const data = prisma.projectSubmission.find
