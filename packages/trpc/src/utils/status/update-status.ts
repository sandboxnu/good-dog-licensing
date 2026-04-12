import { prisma } from "@good-dog/db";
import {
  getAdmModProjectStatus,
  getMediaMakerProjectStatus,
} from "./project-status";
import {
  getAdmModSongRequestStatus,
  getMediaMakerSongRequestStatus,
} from "./song-request-status";
import {
  getAdmModMatchStatus,
  getMediaMakerMatchStatus,
  getMusicianMatchStatus,
} from "./match-status";
import { getMusicianSongStatus } from "./music-status";

export async function updateStatuses(
  projectId: string,
  songRequestId: string,
  matchId: string | null,
  musicId: string,
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

  // Get the song
  const song = await prisma.musicSubmission.findUnique({
    where: {
      musicId,
    },
    select: {
      matches: {
        select: {
          matchState: true,
        },
      },
    },
  });

  if (!song) {
    throw new Error(`Song with id ${musicId} not found.`);
  }

  // Grab match states for project, SR, match, and song
  const matchStatesGroupedBySR = project.songRequests.map((sr) =>
    sr.matches.map((match) => match.matchState),
  );
  const matchStatesForGivenSR = project.songRequests
    .find((sr) => sr.songRequestId === songRequestId)
    ?.matches.map((match) => match.matchState);
  const matchStateOfGivenMatch = project.songRequests
    .find((sr) => sr.songRequestId === songRequestId)
    ?.matches.find((match) => match.matchId === matchId)?.matchState;
  const matchStatesForGivenSong = song.matches.map((match) => match.matchState);

  if (!matchStatesForGivenSR) {
    // this should never be reached -- need to do it for type safety
    throw new Error("Song Request Id not found");
  }

  // Project statuses
  const newAdmModProjectStatus = getAdmModProjectStatus(matchStatesGroupedBySR);
  const newMediaMakerProjectStatus = getMediaMakerProjectStatus(
    matchStatesGroupedBySR,
  );

  // Song Request statuses
  const newAdmModSRStatus = getAdmModSongRequestStatus(matchStatesForGivenSR);
  const newMediaMakerSRStatus = getMediaMakerSongRequestStatus(
    matchStatesForGivenSR,
  );

  // Song status
  const newMusicianSongStatus = getMusicianSongStatus(matchStatesForGivenSong);

  // Update statuses in DB
  await prisma.$transaction([
    prisma.projectSubmission.update({
      where: {
        projectId,
      },
      data: {
        admModStatus: newAdmModProjectStatus,
        mediaMakerStatus: newMediaMakerProjectStatus,
      },
    }),
    prisma.songRequest.update({
      where: {
        songRequestId,
      },
      data: {
        admModStatus: newAdmModSRStatus,
        mediaMakerStatus: newMediaMakerSRStatus,
      },
    }),
    prisma.musicSubmission.update({
      where: {
        musicId,
      },
      data: {
        musicianSongStatus: newMusicianSongStatus,
      },
    }),
  ]);

  // Handle match (separate because it can be deleted)
  if (matchId && matchStateOfGivenMatch) {
    const newAdmModMatchStatus = getAdmModMatchStatus(matchStateOfGivenMatch);
    const newMediaMakerMatchStatus = getMediaMakerMatchStatus(
      matchStateOfGivenMatch,
    );
    const newMusicianMatchStatus = getMusicianMatchStatus(
      matchStateOfGivenMatch,
    );

    await prisma.match.update({
      where: {
        matchId,
      },
      data: {
        admModStatus: newAdmModMatchStatus,
        mediaMakerStatus: newMediaMakerMatchStatus,
        musicianStatus: newMusicianMatchStatus,
      },
    });
  }
}
