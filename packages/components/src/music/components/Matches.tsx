import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { Match } from "./Match";
import { MatchState } from "@good-dog/db";
import Hourglass from "../../svg/Hourglass";

type MatchesWithSongRequests =
  GetProcedureOutput<"getMusicSubmissionById">["matches"][number];

export function Matches({
  state,
  matches,
  selectedMatchId,
  setSelectedMatchId,
}: {
  state: "INCOMING" | "MATCHED" | "REJECTED";
  matches: MatchesWithSongRequests[];
  selectedMatchId: string | null;
  setSelectedMatchId: (matchId: string | null) => void;
}) {
  const filteredMatches = matches.filter((match) => {
    if (state === "INCOMING") {
      return match.matchState === MatchState.SONG_REQUESTED;
    } else if (state === "MATCHED") {
      return match.matchState === MatchState.APPROVED_BY_MUSICIAN;
    } else {
      return match.matchState === MatchState.REJECTED_BY_MUSICIAN;
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
        <Match
          key={match.matchId}
          state={state}
          match={match}
          selectedMatchId={selectedMatchId}
          setSelectedMatchId={setSelectedMatchId}
        />
      ))}
    </div>
  );
}
