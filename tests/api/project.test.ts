import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "bun:test";

import {
  deleteSessionCookieBuilder,
  getSessionCookieBuilder,
  setSessionCookieBuilder,
} from "@good-dog/auth/cookies";
import { passwordService } from "@good-dog/auth/password";
import { prisma } from "@good-dog/db";
import { $createTrpcCaller } from "@good-dog/trpc/server";

import { MockNextCookies } from "../mocks/MockNextCookies";
import { createMockCookieService } from "../mocks/util";

describe("projectSubmission", () => {
  const mockCookies = new MockNextCookies();
  const setSessionCookie = setSessionCookieBuilder(mockCookies);
  const getSessionCookie = getSessionCookieBuilder(mockCookies);
  const deleteSessionCookie = deleteSessionCookieBuilder(mockCookies);

  //   const $api = $createTrpcCaller({
  //     cookiesService: createMockCookieService(mockCookies),
  //     prisma: prisma,
  //   });

  const createSession = async () =>
    prisma.session.create({
      data: {
        expiresAt: new Date("2099-01-01"),
        user: {
          connectOrCreate: {
            create: {
              firstName: "Damian",
              lastName: "Smith",
              role: "MEDIA_MAKER",
              email: "damian@gmail.com",
              hashedPassword: await passwordService.hashPassword("password123"),
            },
            where: {
              email: "damian@gmail.com",
            },
          },
        },
      },
      include: {
        user: true,
      },
    });

  const cleanupAccount = async () => {
    try {
      await prisma.user.delete({
        where: {
          email: "damian@gmail.com",
        },
      });
    } catch (error) {
      void error;
    }
  };

  //   //create a mock user
  //   beforeAll(async () => {
  //     await prisma.$transaction([
  //       prisma.user.create({
  //         data: {
  //           userId: "meggan-user-id",
  //           email: "meggan@test.org",
  //           hashedPassword: "xxxx",
  //           firstName: "Meggan",
  //           lastName: "Shvartsberg",
  //           role: "ADMIN",
  //           sessions: {
  //             create: {
  //               sessionId: "meggan-session-id",
  //               expiresAt: new Date(Date.now() + 5_000_000_000),
  //             },
  //           },
  //         },
  //       }),
  //     ]);
  //   });

  afterEach(() => {
    mockCookies.clear();
  });

  //   afterAll(async () => {
  //     await prisma.projectSubmission.deleteMany({
  //       where: { projectOwner: { userId: "meggan-user-id" } },
  //     });
  //     await prisma.user.delete({ where: { userId: "meggan-user-id" } });
  //   });

  // //Delete the records created for these tests
  // afterAll(async () => {
  //   await prisma.user.deleteMany({
  //     where: {
  //       userId: {
  //         in: ["meggan-user-id"],
  //       },
  //     },
  //   });
  // });

  test("create a project submission", async () => {
    const session = await createSession();
    if (!session.sessionId) {
      throw new Error("Session creation failed: No sessionId returned.");
    }
    setSessionCookie(session.sessionId, new Date("2099-01-01"));
    expect(getSessionCookie()?.value).toBe(session.sessionId);
    //mockCookies.set("sessionId", session.sessionId);
    const $api = $createTrpcCaller({
      cookiesService: createMockCookieService(mockCookies),
      prisma,
    });

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
      where: { projectOwner: { userId: session.user.userId } },
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

    deleteSessionCookie();
    expect(getSessionCookie()).toBeUndefined();
    await cleanupAccount();
  });
});
