import type { MatchState, Role, Status } from "@good-dog/db";
import { getMatchStatus } from "./match-status";

// Logic for song request statuses

const ALLOWED_STATUSES_BY_ROLE: Record<Role, Status[]> = {
  ADMIN: ["COMPLETED", "APPROVAL_NEEDED", "IN_PROGRESS", "SUGGESTIONS_NEEDED"],
  MODERATOR: [
    "COMPLETED",
    "APPROVAL_NEEDED",
    "IN_PROGRESS",
    "SUGGESTIONS_NEEDED",
  ],
  MEDIA_MAKER: ["IN_PROGRESS", "APPROVAL_NEEDED", "COMPLETED"],
  MUSICIAN: [], // Musicians don't have song requests
};

function getAdminSongRequestStatus(matches: MatchState[]): Status {
  const matchStatuses = matches.map((match) => getMatchStatus(match, "ADMIN"));

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

function getMediaMakerSongRequestStatus(matches: MatchState[]): Status {
  const matchStatuses = matches.map((match) =>
    getMatchStatus(match, "MEDIA_MAKER"),
  );

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

function getSongRequestStatusForRole(
  matches: MatchState[],
  role: Role,
): Status {
  switch (role) {
    case "ADMIN":
    case "MODERATOR":
      return getAdminSongRequestStatus(matches);

    case "MEDIA_MAKER":
      return getMediaMakerSongRequestStatus(matches);

    case "MUSICIAN":
      throw new Error("Musicians don't have song requests.");
  }
}

export function getSongRequestStatus(
  matches: MatchState[],
  role: Role,
): Status {
  const status = getSongRequestStatusForRole(matches, role);

  if (!ALLOWED_STATUSES_BY_ROLE[role].includes(status)) {
    throw new Error(
      `Invalid status ${status} for role ${role}. Allowed statuses: ${ALLOWED_STATUSES_BY_ROLE[
        role
      ].join(", ")}`,
    );
  }

  return status;
}
