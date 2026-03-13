import type {
  AdmModMatchStatus,
  MatchState,
  MediaMakerMatchStatus,
  MusicianMatchStatus,
} from "@good-dog/db";

// Logic for match statuses

export function getAdmModMatchStatus(
  matchState: MatchState,
): AdmModMatchStatus {
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

export function getMusicianMatchStatus(
  matchState: MatchState,
): MusicianMatchStatus {
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

export function getMediaMakerMatchStatus(
  matchState: MatchState,
): MediaMakerMatchStatus {
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
