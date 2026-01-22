import type { MatchState } from "@good-dog/db";
import type { StatusIndicatorType } from "../src/base/StatusIndicator";

interface SongRequestWithMatches {
  matches: {
    matchState: MatchState;
  }[];
}

export function getSongRequestStatus(
  songRequestWithMatches: SongRequestWithMatches,
): StatusIndicatorType {
  if (
    songRequestWithMatches.matches.some(
      (match) => match.matchState === "SENT_TO_MEDIA_MAKER",
    )
  ) {
    return { variant: "error", text: "Action needed" };
  }

  if (
    songRequestWithMatches.matches.some(
      (match) => match.matchState === "SONG_REQUESTED",
    )
  ) {
    return { variant: "blue", text: "Pending approval" };
  }

  if (
    songRequestWithMatches.matches.some(
      (match) => match.matchState === "APPROVED_BY_MUSICIAN",
    )
  ) {
    return { variant: "success", text: "Accepted" };
  }

  return { variant: "warning", text: "In progress" };
}
