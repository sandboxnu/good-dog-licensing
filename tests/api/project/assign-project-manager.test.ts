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

describe("assignProjectManager", () => {
  const mockCookies = new MockNextCookies();
  const mockEmailService = new MockEmailService();

  const $api = $createTrpcCaller({
    cookiesService: createMockCookieService(mockCookies),
    emailService: mockEmailService,
    prisma,
  });

  let adminUserId: string;
  let moderatorUserId: string;
  let mediamakerUserId: string;
  let projectId: string;

  beforeAll(async () => {
    const users = await prisma.$transaction([
      prisma.user.create({
        data: {
          firstName: "Admin",
          lastName: "User",
          role: "ADMIN",
          email: "admin@test.org",
          phoneNumber: "123-456-7890",
          hashedPassword: "password123",
          sessions: {
            create: {
              sessionId: "admin-session-id",
              expiresAt: new Date("2099-01-01"),
            },
          },
        },
      }),
      prisma.user.create({
        data: {
          firstName: "Moderator",
          lastName: "User",
          role: "MODERATOR",
          email: "moderator@test.org",
          phoneNumber: "123-456-7890",
          hashedPassword: "password123",
          sessions: {
            create: {
              sessionId: "moderator-session-id",
              expiresAt: new Date("2099-01-01"),
            },
          },
        },
      }),
      prisma.user.create({
        data: {
          firstName: "Media",
          lastName: "Maker",
          role: "MEDIA_MAKER",
          email: "mediamaker@test.org",
          phoneNumber: "123-456-7890",
          hashedPassword: "password123",
          sessions: {
            create: {
              sessionId: "mediamaker-session-id",
              expiresAt: new Date("2099-01-01"),
            },
          },
        },
      }),
      prisma.user.create({
        data: {
          firstName: "Project",
          lastName: "Owner",
          role: "MEDIA_MAKER",
          email: "projectowner@test.org",
          phoneNumber: "123-456-7890",
          hashedPassword: "password123",
          sessions: {
            create: {
              sessionId: "projectowner-session-id",
              expiresAt: new Date("2099-01-01"),
            },
          },
        },
      }),
    ]);

    adminUserId = users[0].userId;
    moderatorUserId = users[1].userId;
    mediamakerUserId = users[2].userId;
    const projectOwnerUserId = users[3].userId;

    // Create a project submission
    const project = await prisma.projectSubmission.create({
      data: {
        projectTitle: "Test Project",
        description: "A test project",
        deadline: new Date(),
        videoLink: "https://test.com/video",
        additionalInfo: "Test info",
        projectType: ProjectType.MOTION_PICTURE,
        projectOwnerId: projectOwnerUserId,
      },
    });

    projectId = project.projectId;
  });

  afterEach(() => {
    mockCookies.clear();
    mockEmailService.clear();
  });

  afterAll(async () => {
    await prisma.$transaction([
      prisma.songRequest.deleteMany({
        where: { projectId },
      }),
      prisma.projectSubmission.deleteMany({
        where: { projectId },
      }),
      prisma.user.deleteMany({
        where: {
          OR: [
            { email: "admin@test.org" },
            { email: "moderator@test.org" },
            { email: "mediamaker@test.org" },
            { email: "projectowner@test.org" },
          ],
        },
      }),
    ]);
  });

  test("assign an admin as project manager", async () => {
    mockCookies.set("sessionId", "admin-session-id");

    const response = await $api.assignProjectManager({
      projectId,
      projectManagerId: adminUserId,
    });

    expect(response).toEqual({
      message: "Project manager successfully assigned.",
    });

    const updatedProject = await prisma.projectSubmission.findUnique({
      where: { projectId },
    });

    expect(updatedProject?.projectManagerId).toBe(adminUserId);
  });

  test("assign a moderator as project manager", async () => {
    mockCookies.set("sessionId", "admin-session-id");

    const response = await $api.assignProjectManager({
      projectId,
      projectManagerId: moderatorUserId,
    });

    expect(response).toEqual({
      message: "Project manager successfully assigned.",
    });

    const updatedProject = await prisma.projectSubmission.findUnique({
      where: { projectId },
    });

    expect(updatedProject?.projectManagerId).toBe(moderatorUserId);
  });

  test("reject assignment of MEDIA_MAKER as project manager", async () => {
    mockCookies.set("sessionId", "admin-session-id");

    expect(
      $api.assignProjectManager({
        projectId,
        projectManagerId: mediamakerUserId,
      }),
    ).rejects.toThrow("Project manager must be an admin or moderator");
  });

  test("reject assignment with non-existent project manager", async () => {
    mockCookies.set("sessionId", "admin-session-id");

    expect(
      $api.assignProjectManager({
        projectId,
        projectManagerId: "non-existent-user-id",
      }),
    ).rejects.toThrow("Project manager id not found");
  });

  test("reject assignment without admin permissions", async () => {
    mockCookies.set("sessionId", "mediamaker-session-id");

    expect(
      $api.assignProjectManager({
        projectId,
        projectManagerId: adminUserId,
      }),
    ).rejects.toThrow();
  });
});
