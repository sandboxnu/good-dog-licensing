import type { MatchState, MusicianSongStatus } from "@good-dog/db";
import { getMusicianMatchStatus } from "./match-status";

export function getMusicianSongStatus(
  matches: MatchState[],
): MusicianSongStatus {
  const matchStatuses = matches.map((match) => getMusicianMatchStatus(match));

  // If at least 1 APPROVAL_NEEDED --> ACTION_NEEDED
  if (matchStatuses.some((status) => status === "APPROVAL_NEEDED")) {
    return "ACTION_NEEDED";
  }

  // else --> SONG_SUBMITTED
  return "SONG_SUBMITTED";
}
