import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { MatchState } from "@good-dog/db";
import Hourglass from "../../svg/Hourglass";
import { Match } from "./Match";

type MatchesWithMusicSubmission =
  GetProcedureOutput<"getSongRequestById">["matches"][number];

export function ListOfMatches({
  state,
  matches,
}: {
  state: "INCOMING" | "PENDING_APPROVAL" | "MATCHED" | "REJECTED";
  matches: MatchesWithMusicSubmission[];
}) {
  const filteredMatches = matches.filter((match) => {
    if (state === "INCOMING") {
      return match.matchState === MatchState.NEW;
    } else if (state === "PENDING_APPROVAL") {
      return match.matchState === MatchState.SONG_REQUESTED;
    } else if (state === "MATCHED") {
      return match.matchState === MatchState.APPROVED_BY_MUSICIAN;
    } else {
      return (
        match.matchState === MatchState.REJECTED_BY_MEDIA_MAKER ||
        match.matchState === MatchState.REJECTED_BY_MUSICIAN
      );
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <p className="w-full">Review and approve/deny the songs matched below</p>
      {filteredMatches.length === 0 && (
        <div className="flex flex-col items-center gap-2 mt-16 min-w-[778px]">
          <Hourglass />
          <p>No requests active at this time</p>
        </div>
      )}
      {filteredMatches.map((match) => (
        <Match key={match.matchId} state={state} match={match} />
      ))}
    </div>
  );
}
