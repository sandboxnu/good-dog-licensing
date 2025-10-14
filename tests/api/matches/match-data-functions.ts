// Functions for assistance in creating and cleaning up data for tests
// Used to set up examples of users with each permission level to test authorization to perform actions and results.

import { passwordService } from "@good-dog/auth/password";
import { prisma } from "@good-dog/db";

export async function createData() {
  prisma.user.create({
    data: {
      userId: "matcher",
      firstName: "Jane",
      lastName: "Doe",
      role: "MODERATOR",
      phoneNumber: "1234556789",
      email: "bestmod123@gmail.com",
      hashedPassword: await passwordService.hashPassword("passcodeispasscode"),
      sessions: {
        create: {
          sessionId: "moderator-session-id",
          expiresAt: new Date(Date.now() + 5_000_000_000),
        },
      },
    },
  });

  const musician = await prisma.user.create({
    data: {
      userId: "musician",
      firstName: "ABCDEF",
      lastName: "ABCDEF",
      role: "MUSICIAN",
      phoneNumber: "2234567890",
      email: "musician@gmail.com",
      hashedPassword: await passwordService.hashPassword("password123"),
      sessions: {
        create: {
          sessionId: "musician-session-id",
          expiresAt: new Date(Date.now() + 5_000_000_000),
        },
      },
    },
  });

  await prisma.musicSubmission.create({
    data: {
      musicId: "musicSubmission",
      songName: "3005",
      songLink:
        "https://open.spotify.com/track/2X6b7zLdIxCejd6GqVcQ9M?si=b36f9306fab04109",
      genre: "hip hop",
      submitterId: musician.userId,
      performerName: "The Beatles",
    },
  });

  const projectOwner = await prisma.user.create({
    data: {
      userId: "projectOwner",
      firstName: "Project",
      lastName: "Owner",
      role: "MEDIA_MAKER",
      phoneNumber: "3234567890",
      email: "project@gmail.com",
      hashedPassword: await passwordService.hashPassword("password123"),
      sessions: {
        create: {
          sessionId: "mediamaker-session-id",
          expiresAt: new Date(Date.now() + 5_000_000_000),
        },
      },
    },
  });

  const projectSubmission = await prisma.projectSubmission.create({
    data: {
      projectId: "projectSubmission",
      projectOwnerId: projectOwner.userId,
      projectTitle: "title",
      description: "a project hoping to showcase the effects of climate change",
      deadline: new Date(Date.now() + 2_000_000_000),
    },
  });

  await prisma.songRequest.create({
    data: {
      oneLineSummary: "Test One Line Summary",
      songRequestId: "songRequestOneSubmission",
      description: "wildfires in CA",
      musicType: "rnb, soul",
      projectId: projectSubmission.projectId,
    },
  });

  await prisma.user.create({
    data: {
      userId: "sanjana",
      firstName: "ABCDEF",
      lastName: "ABCDEF",
      role: "ADMIN",
      phoneNumber: "4234567890",
      email: "sanjana@gmail.com",
      hashedPassword: await passwordService.hashPassword("password123"),
      sessions: {
        create: {
          sessionId: "admin-session-id",
          expiresAt: new Date(Date.now() + 5_000_000_000),
        },
      },
    },
  });
}

export async function createMoreData() {
  await prisma.match.create({
    data: {
      matchId: "match",
      songRequestId: "songRequestOneSubmission",
      musicId: "musicSubmission",
      matcherUserId: "matcher",
      matchState: "NEW",
    },
  });

  await prisma.comments.create({
    data: {
      commentId: "testComment",
      userId: "matcher",
      commentText: "hello",
      songRequestId: "songRequestOneSubmission",
    },
  });
}

export async function deleteData() {
  // Delete Comments (created in tests)
  await prisma.comments.deleteMany({
    where: {
      songRequestId: "songRequestOneSubmission",
    },
  });

  // Delete Match
  await prisma.match.deleteMany({
    where: { matchId: "match" },
  });

  // Delete Match for suggestMatch tests
  await prisma.match.deleteMany({
    where: {
      songRequestId: "songRequestOneSubmission",
    },
  });

  // Delete SongRequest
  await prisma.songRequest.deleteMany({
    where: { songRequestId: "songRequestOneSubmission" },
  });

  // Delete ProjectSubmission
  await prisma.projectSubmission.deleteMany({
    where: { projectId: "projectSubmission" },
  });

  // Delete MusicSubmission
  await prisma.musicSubmission.deleteMany({
    where: { musicId: "musicSubmission" },
  });

  // Delete Users
  await prisma.user.deleteMany({
    where: {
      userId: {
        in: ["matcher", "musician", "projectOwner", "sanjana"],
      },
    },
  });
}
