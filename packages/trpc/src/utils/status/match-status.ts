import type { MatchState, Role, Status } from "@good-dog/db";

// Logic for match statuses

function getAdminMatchStatus(matchState: MatchState): Status {
  switch (matchState) {
    case "WAITING_FOR_MANAGER_APPROVAL":
      return "APPROVAL_NEEDED";

    case "REJECTED_BY_MANAGER":
    case "REJECTED_BY_MEDIA_MAKER":
    case "REJECTED_BY_MUSICIAN":
      return "REJECTED";

    case "SENT_TO_MEDIA_MAKER":
    case "SENT_TO_MUSICIAN":
      return "IN_PROGRESS";

    case "APPROVED_BY_MUSICIAN":
      return "COMPLETED";
  }
}

function getMusicianMatchStatus(matchState: MatchState): Status {
  switch (matchState) {
    case "REJECTED_BY_MUSICIAN":
      return "REJECTED";

    case "SENT_TO_MUSICIAN":
      return "APPROVAL_NEEDED";

    case "APPROVED_BY_MUSICIAN":
      return "COMPLETED";

    case "REJECTED_BY_MANAGER":
    case "REJECTED_BY_MEDIA_MAKER":
    case "SENT_TO_MEDIA_MAKER":
    case "WAITING_FOR_MANAGER_APPROVAL":
      return "HIDDEN";
  }
}

function getMediaMakerMatchStatus(matchState: MatchState): Status {
  switch (matchState) {
    case "REJECTED_BY_MEDIA_MAKER":
    case "REJECTED_BY_MUSICIAN":
      return "REJECTED";

    case "SENT_TO_MUSICIAN":
      return "IN_PROGRESS";

    case "APPROVED_BY_MUSICIAN":
      return "COMPLETED";

    case "SENT_TO_MEDIA_MAKER":
      return "APPROVAL_NEEDED";

    case "REJECTED_BY_MANAGER":
    case "WAITING_FOR_MANAGER_APPROVAL":
      return "HIDDEN";
  }
}

function getMatchStatusForRole(matchState: MatchState, role: Role): Status {
  switch (role) {
    case "ADMIN":
    case "MODERATOR":
      return getAdminMatchStatus(matchState);

    case "MEDIA_MAKER":
      return getMediaMakerMatchStatus(matchState);

    case "MUSICIAN":
      return getMusicianMatchStatus(matchState);
  }
}

export function getMatchStatus(matchState: MatchState, role: Role): Status {
  return getMatchStatusForRole(matchState, role);
}
