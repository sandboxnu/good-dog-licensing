import type {
  AdmModProjectStatus,
  MatchState,
  MediaMakerProjectStatus,
} from "@good-dog/db";
import {
  getAdmModSongRequestStatus,
  getMediaMakerSongRequestStatus,
} from "./song-request-status";

// Logic for project statuses

export function getAdmModProjectStatus(
  songRequests: MatchState[][],
): AdmModProjectStatus {
  const songRequestStatuses = songRequests.map((matches) =>
    getAdmModSongRequestStatus(matches),
  );

  // If all COMPLETED --> COMPLETED
  if (songRequestStatuses.every((status) => status === "COMPLETED")) {
    return "COMPLETED";
  }

  // If 1 APPROVAL_NEEDED or SUGGESTIONS_NEEDED --> ACTION_NEEDED
  if (
    songRequestStatuses.some(
      (status) =>
        status === "APPROVAL_NEEDED" || status === "SUGGESTIONS_NEEDED",
    )
  ) {
    return "ACTION_NEEDED";
  }

  // else --> IN_PROGRESS
  return "IN_PROGRESS";
}

export function getMediaMakerProjectStatus(
  songRequests: MatchState[][],
): MediaMakerProjectStatus {
  const songRequestStatuses = songRequests.map((matches) =>
    getMediaMakerSongRequestStatus(matches),
  );

  // If all COMPLETED --> COMPLETED
  if (songRequestStatuses.every((status) => status === "COMPLETED")) {
    return "COMPLETED";
  }

  // If 1 APPROVAL_NEEDED --> ACTION_NEEDED
  if (songRequestStatuses.some((status) => status === "APPROVAL_NEEDED")) {
    return "ACTION_NEEDED";
  }

  // else --> IN_PROGRESS
  return "IN_PROGRESS";
}
