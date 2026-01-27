import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { MatchState } from "@good-dog/db";
import Hourglass from "../../svg/Hourglass";
import { Match } from "./Match";

type MatchesWithMusicSubmission =
  GetProcedureOutput<"getSongRequestById">["matches"][number];

export function Matches({
  state,
  matches,
  selectedMatchId,
  setSelectedMatchId,
}: {
  state: "INCOMING" | "PENDING_APPROVAL" | "MATCHED" | "REJECTED";
  matches: MatchesWithMusicSubmission[];
  selectedMatchId: string | null;
  setSelectedMatchId: (matchId: string | null) => void;
}) {
  const filteredMatches = matches.filter((match) => {
    if (state === "INCOMING") {
      return match.matchState === MatchState.SENT_TO_MEDIA_MAKER;
    } else if (state === "PENDING_APPROVAL") {
      return match.matchState === MatchState.SENT_TO_MUSICIAN;
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
      <p className="w-full text-dark-gray-500 dark:text-mint-200">
        Review and approve/deny the songs matched below
      </p>
      {filteredMatches.length === 0 && (
        <div className="flex flex-col items-center gap-2 mt-16 min-w-[778px]">
          <Hourglass size="large" />
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
