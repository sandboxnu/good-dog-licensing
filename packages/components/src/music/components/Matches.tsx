import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { MatchState } from "@good-dog/db";

import Hourglass from "../../svg/Hourglass";
import { Match } from "./Match";

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
      return match.matchState === MatchState.SENT_TO_MUSICIAN;
    } else if (state === "MATCHED") {
      return match.matchState === MatchState.APPROVED_BY_MUSICIAN;
    } else {
      return match.matchState === MatchState.REJECTED_BY_MUSICIAN;
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <p className="w-full text-dark-gray-500 dark:text-mint-200">
        Review and approve/deny the songs matched below
      </p>
      {filteredMatches.length === 0 && (
        <div className="mt-16 flex w-full flex-col items-center gap-2">
          <div className="w-3/4 lg:w-1/2">
            <Hourglass size="large" className="h-auto w-full" />
          </div>
          <p className="text-dark-gray-500 dark:text-gray-200">
            No requests active at this time
          </p>
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
