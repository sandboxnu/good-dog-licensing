import { MatchState } from "@prisma/client";
import type {
  Match,
  ProjectSubmission,
  SongRequest,
  User,
} from "@prisma/client";

type SongRequestWithMatch = SongRequest & { matches: Match[] };

interface SongRequests {
  songRequests: SongRequestWithMatch[];
}

export type ProjectSubmissionWithSongRequestAndMatches = ProjectSubmission &
  SongRequests & { projectOwner: User };

export default function getStatusFromProject(
  project: ProjectSubmissionWithSongRequestAndMatches,
): "Not assigned" | "In progress" | "In review" | "Matched" {
  const actionRequired = project.songRequests.some((songReq) =>
    songReq.matches.some(
      (match) => match.matchState === MatchState.SENT_TO_MEDIA_MAKER,
    ),
  );
  // Something approved by media maker but not by musician
  const pendingApproval = project.songRequests.some((songReq) =>
    songReq.matches.some(
      (match) => match.matchState === MatchState.SENT_TO_MUSICIAN,
    ),
  );

  // Complete when all requests in approved by musician state
  const Matched = project.songRequests.every((scene) =>
    scene.matches.every(
      (match) => match.matchState === MatchState.APPROVED_BY_MUSICIAN,
    ),
  );

  const matchSize = project.songRequests.reduce((prev, song) => {
    return prev + song.matches.length;
  }, 0);

  return actionRequired
    ? "In progress"
    : pendingApproval
      ? "In review"
      : matchSize === 0
        ? "Not assigned"
        : Matched
          ? "Matched"
          : "Not assigned";
}
