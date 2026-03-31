import { PrismaClient } from "@prisma/client";
import type { Role } from "@good-dog/db";
import {
  allGenres,
  firstNames,
  lastNames,
  realUsers,
  adjectives,
  links,
  nouns,
  projectDescriptions,
  allProjectTypes,
  additionalInfo,
} from "./utils/seedData";

const prisma = new PrismaClient();

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
  const generatedModerators = generateUsers("moderator", "MODERATOR", 100, 20);
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

  const userUpserts = usersToUpsert.map((user) =>
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

  const songCreations = generatedSongs.map((song) =>
    prisma.musicSubmission.create({
      data: {
        songName: song.songName,
        performerName: song.performerName,
        submitterId: song.submitterId,
        songLink: song.songLink,
        genres: song.genres,
        additionalInfo: song.additionalInfo,
        contributors: {
          create: Array.from({ length: 3 }, () => ({
            firstName: "Test",
            lastName: "User",
            roles: ["SONGWRITER"],
          })),
        },
      },
    }),
  );

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

  const projectCreations = generatedProjects.map((project) =>
    prisma.projectSubmission.create({
      data: {
        projectTitle: project.projectTitle,
        description: project.description,
        projectOwnerId: project.projectOwnerId,
        projectManagerId: project.projectManagerId,
        createdAt: project.createdAt,
        deadline: project.deadline,
        projectType: project.projectType,
        additionalInfo: project.additionalInfo,
        videoLink: project.videoLink,
      },
    }),
  );

  await prisma.$transaction([...userUpserts, ...songCreations]);
  const createdProjects = await prisma.$transaction(projectCreations);

  // Generate song requests

  const songRequestCreations = createdProjects.flatMap((project) => {
    const requestCount = Math.floor(Math.random() * 21);
    return generateSongRequests(project.projectId, requestCount).map(
      (songRequest) =>
        prisma.songRequest.create({
          data: {
            projectId: songRequest.projectId,
            songRequestTitle: songRequest.songRequestTitle,
            description: songRequest.description,
            feelingsConveyed: songRequest.feelingsConveyed,
            similarSongs: songRequest.similarSongs,
            additionalInfo: songRequest.additionalInfo,
          },
        }),
    );
  });

  if (songRequestCreations.length > 0) {
    await prisma.$transaction(songRequestCreations);
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
