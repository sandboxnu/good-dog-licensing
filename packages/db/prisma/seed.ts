import type { Role } from "@good-dog/db";
import { prisma } from "@good-dog/db";

import {
  additionalInfo,
  adjectives,
  allGenres,
  allProjectTypes,
  firstNames,
  lastNames,
  links,
  nouns,
  projectDescriptions,
  realUsers,
} from "./utils/seedData";

function randomFromArray<T>(items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error("Cannot pick a random item from an empty array");
  }

  const item = items[Math.floor(Math.random() * items.length)];
  if (item === undefined) {
    throw new Error("Random selection resulted in undefined");
  }
  return item;
}

function generateSongRequests(projectId: string, count: number) {
  return Array.from({ length: count }, () => {
    const adjective = randomFromArray(adjectives);
    const noun = randomFromArray(nouns);
    const title = `${adjective} ${noun}`;

    return {
      projectId,
      songRequestTitle: title,
      description: randomFromArray(projectDescriptions),
      feelingsConveyed: randomFromArray(additionalInfo),
      similarSongs:
        "Here is a list of similar songs: Blank Space by Taylor Swift, Bad Guy by Billie Eilish, and Uptown Funk by Mark Ronson ft. Bruno Mars. I have a few more as well",
      additionalInfo: randomFromArray(additionalInfo),
    };
  });
}

function generateProjects(userId: string, managerId: string, count: number) {
  return Array.from({ length: count }, () => {
    const adjective = randomFromArray(adjectives);
    const noun = randomFromArray(nouns);
    const projectTitle = `${adjective} ${noun}`;

    return {
      projectOwnerId: userId,
      projectManagerId: managerId,
      projectTitle,
      description: randomFromArray(projectDescriptions),
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 1.5 * 24 * 60 * 60 * 1000,
      ),
      deadline: new Date(
        Date.now() - Math.random() * 365 * 1.5 * 24 * 60 * 60 * 1000,
      ),
      projectType: randomFromArray(allProjectTypes),
      additionalInfo: randomFromArray(additionalInfo),
      videoLink: randomFromArray(links),
    };
  });
}

function generateSongs(userId: string, userName: string, count: number) {
  return Array.from({ length: count }, () => {
    const adjective = randomFromArray(adjectives);
    const noun = randomFromArray(nouns);
    const songName = `${adjective} ${noun}`;

    const primaryGenre = randomFromArray(allGenres);
    const secondaryGenre = randomFromArray(allGenres);

    return {
      submitterId: userId,
      performerName: userName,
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 1.5 * 24 * 60 * 60 * 1000,
      ),
      songName,
      songLink: randomFromArray(links),
      genres: [primaryGenre, secondaryGenre],
      additionalInfo: randomFromArray(additionalInfo),
      songLyrics: "",
    };
  });
}

function generateUsers(
  emailPrefix: string,
  role: Role,
  count: number,
  inactiveCount: number,
) {
  return Array.from({ length: count }, (_, index) => {
    const sequence = index + 1;
    const firstName = randomFromArray(firstNames);
    const lastName = randomFromArray(lastNames);

    return {
      firstName,
      lastName,
      email: `${emailPrefix}${sequence}@example.com`,
      userId: `${emailPrefix}${sequence}`,
      role,
      active: index < count - inactiveCount,
    };
  });
}

async function main() {
  // Plaintext: Password1!
  const hashedPassword =
    "$2a$10$ghWIDof5gMFi7D2Deea.C.HptdD0nvsYIqEFpWuQVvoyJ8HdhPtR2";

  // Generate users
  const generatedModerators = generateUsers("moderator", "MODERATOR", 10, 2);
  const generatedMediamakers = generateUsers(
    "mediamaker",
    "MEDIA_MAKER",
    100,
    20,
  );
  const generatedMusicians = generateUsers("musician", "MUSICIAN", 100, 20);

  const usersToUpsert = [
    ...realUsers.map((user) => ({
      ...user,
      userId: `${user.email.split("@")[0]}`,
      role: "ADMIN" as const,
      active: true,
    })),
    ...generatedModerators,
    ...generatedMediamakers,
    ...generatedMusicians,
  ];

  // The seed used to run every write inside a few large `$transaction([...])`
  // batches. With the Prisma 7 driver adapter those run as interactive
  // transactions with a 5s timeout, which the remote preview database
  // exceeded (one round trip per statement). Bulk inserts keep the whole seed
  // to a handful of queries plus the user upserts.

  // Upsert users so the seed can be re-run without a reset
  await Promise.all(
    usersToUpsert.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: {
          firstName: user.firstName,
          lastName: user.lastName,
          userId: user.userId,
          phoneNumber: "1231231234",
          hashedPassword: hashedPassword,
          role: user.role,
          active: user.active,
        },
        create: {
          email: user.email,
          userId: user.userId,
          phoneNumber: "1231231234",
          hashedPassword: hashedPassword,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          active: user.active,
        },
      }),
    ),
  );

  // Generate songs
  const songCounts = [30, 40, 10, 10, 10, 10, 10, 10, 10, 10];
  const generatedSongs = generatedMusicians.flatMap((m, i) => {
    if (i >= songCounts.length) {
      return [];
    }

    return generateSongs(
      m.userId,
      `${m.firstName} ${m.lastName}`,
      songCounts[i] ?? 10,
    );
  });

  // A few of the first musician's songs were "posted by an admin" and are
  // still waiting on the musician's review, so the pending flow has data.
  const postingAdminId = usersToUpsert.find((u) => u.role === "ADMIN")?.userId;
  const PENDING_REVIEW_SONG_COUNT = 3;

  const createdSongs = await prisma.musicSubmission.createManyAndReturn({
    data: generatedSongs.map((song, index) => ({
      songName: song.songName,
      performerName: song.performerName,
      submitterId: song.submitterId,
      songLink: song.songLink,
      genres: song.genres,
      additionalInfo: song.additionalInfo,
      songLyrics: song.songLyrics,
      ...(postingAdminId && index < PENDING_REVIEW_SONG_COUNT
        ? {
            approvalStatus: "WAITING_FOR_MUSICIAN_REVIEW" as const,
            postedByAdminId: postingAdminId,
          }
        : {}),
    })),
    select: { musicId: true },
  });

  await prisma.musicContributor.createMany({
    data: createdSongs.flatMap((song) =>
      Array.from({ length: 3 }, () => ({
        musicSubmissionId: song.musicId,
        firstName: "Test",
        lastName: "User",
        roles: ["SONGWRITER" as const],
      })),
    ),
  });

  // Generate projects
  const projectCounts = [30, 40, 10, 10, 10, 102, 2, 2, 2, 1, 1, 1];
  const generatedProjects = generatedMediamakers.flatMap((m, i) => {
    if (i >= projectCounts.length) {
      return [];
    }

    return generateProjects(
      m.userId,
      generatedModerators[i]?.userId ?? "moderator1",
      projectCounts[i] ?? 10,
    );
  });

  const createdProjects = await prisma.projectSubmission.createManyAndReturn({
    data: generatedProjects,
    select: { projectId: true },
  });

  // Generate song requests
  const songRequests = createdProjects.flatMap((project) =>
    generateSongRequests(project.projectId, Math.floor(Math.random() * 5)),
  );

  if (songRequests.length > 0) {
    await prisma.songRequest.createMany({ data: songRequests });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
