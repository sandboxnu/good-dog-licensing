import type { MatchState, Role, Status } from "@good-dog/db";
import { getSongRequestStatus } from "./song-request-status";

// Logic for project statuses

function getAdminProjectStatus(songRequests: MatchState[][]): Status {
  const songRequestStatuses = songRequests.map((matches) =>
    getSongRequestStatus(matches, "ADMIN"),
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

function getMediaMakerProjectStatus(songRequests: MatchState[][]): Status {
  const songRequestStatuses = songRequests.map((matches) =>
    getSongRequestStatus(matches, "MEDIA_MAKER"),
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

function getProjectStatusForRole(
  songRequests: MatchState[][],
  role: Role,
): Status {
  switch (role) {
    case "ADMIN":
    case "MODERATOR":
      return getAdminProjectStatus(songRequests);

    case "MEDIA_MAKER":
      return getMediaMakerProjectStatus(songRequests);

    case "MUSICIAN":
      throw new Error("Musicians don't have projects.");
  }
}

export function getProjectStatus(
  songRequests: MatchState[][],
  role: Role,
): Status {
  const status = getProjectStatusForRole(songRequests, role);

  return status;
}
