import type {
  AdmModSongRequestStatus,
  MatchState,
  MediaMakerSongRequestStatus,
} from "@good-dog/db";
import { getAdmModMatchStatus, getMediaMakerMatchStatus } from "./match-status";

// Logic for song request statuses

export function getAdmModSongRequestStatus(
  matches: MatchState[],
): AdmModSongRequestStatus {
  const matchStatuses = matches.map((match) => getAdmModMatchStatus(match));

  // If at least 1 COMPLETED --> COMPLETED
  if (matchStatuses.some((status) => status === "COMPLETED")) {
    return "COMPLETED";
  }

  // If at least 1 APPROVAL_NEEDED --> APPROVAL_NEEDED
  if (matchStatuses.some((status) => status === "APPROVAL_NEEDED")) {
    return "APPROVAL_NEEDED";
  }

  // If at least 1 IN_PROGRESS --> IN_PROGRESS
  if (matchStatuses.some((status) => status === "IN_PROGRESS")) {
    return "IN_PROGRESS";
  }

  // else --> SUGGESTIONS_NEEDED
  return "SUGGESTIONS_NEEDED";
}

export function getMediaMakerSongRequestStatus(
  matches: MatchState[],
): MediaMakerSongRequestStatus {
  const matchStatuses = matches.map((match) => getMediaMakerMatchStatus(match));

  // If at least 1 COMPLETED --> COMPLETED
  if (matchStatuses.some((status) => status === "COMPLETED")) {
    return "COMPLETED";
  }

  // If at least 1 APPROVAL_NEEDED --> APPROVAL_NEEDED
  if (matchStatuses.some((status) => status === "APPROVAL_NEEDED")) {
    return "APPROVAL_NEEDED";
  }

  // else --> IN_PROGRESS
  return "IN_PROGRESS";
}
