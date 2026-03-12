import { prisma } from "@good-dog/db";
import { getProjectStatus } from "./project-status";
import { getSongRequestStatus } from "./song-request-status";
import { getMatchStatus } from "./match-status";

export async function updateStatuses(
  projectId: string,
  songRequestId: string,
  matchId: string | null,
) {
  // Get the project
  const project = await prisma.projectSubmission.findUnique({
    where: {
      projectId,
    },
    include: {
      songRequests: {
        include: {
          matches: true,
        },
      },
    },
  });

  if (!project) {
    throw new Error(`Project with id ${projectId} not found.`);
  }

  // Grab match states for project, SR, and match
  const matchStatesGroupedBySR = project.songRequests.map((sr) =>
    sr.matches.map((match) => match.matchState),
  );
  const matchStatesForGivenSR = project.songRequests
    .find((sr) => sr.songRequestId === songRequestId)
    ?.matches.map((match) => match.matchState);
  const matchStateOfGivenMatch = project.songRequests
    .find((sr) => sr.songRequestId === songRequestId)
    ?.matches.find((match) => match.matchId === matchId)?.matchState;

  if (!matchStatesForGivenSR) {
    // this should never be reached -- need to do it for type safety
    throw new Error("Song Request Id not found");
  }

  // Project statuses
  const newProjectAdminStatus = getProjectStatus(
    matchStatesGroupedBySR,
    "ADMIN",
  );
  const newProjectMediaMakerStatus = getProjectStatus(
    matchStatesGroupedBySR,
    "MEDIA_MAKER",
  );

  // Song Request statuses
  const newSRAdminStatus = getSongRequestStatus(matchStatesForGivenSR, "ADMIN");
  const newSRMediaMakerStatus = getSongRequestStatus(
    matchStatesForGivenSR,
    "MEDIA_MAKER",
  );

  // Update statuses in DB
  await prisma.$transaction([
    prisma.projectSubmission.update({
      where: {
        projectId,
      },
      data: {
        adminStatus: newProjectAdminStatus,
        mediaMakerStatus: newProjectMediaMakerStatus,
      },
    }),
    prisma.songRequest.update({
      where: {
        songRequestId,
      },
      data: {
        adminStatus: newSRAdminStatus,
        mediaMakerStatus: newSRMediaMakerStatus,
      },
    }),
  ]);

  // Handle match (separate because it can be deleted)
  if (matchId && matchStateOfGivenMatch) {
    const newMatchAdminStatus = getMatchStatus(matchStateOfGivenMatch, "ADMIN");
    const newMatchMediaMakerStatus = getMatchStatus(
      matchStateOfGivenMatch,
      "MEDIA_MAKER",
    );
    const newMatchMusicianStatus = getMatchStatus(
      matchStateOfGivenMatch,
      "MUSICIAN",
    );

    await prisma.match.update({
      where: {
        matchId,
      },
      data: {
        adminStatus: newMatchAdminStatus,
        mediaMakerStatus: newMatchMediaMakerStatus,
        musicianStatus: newMatchMusicianStatus,
      },
    });
  }
}
