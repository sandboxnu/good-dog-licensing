import type { ReactNode } from "react";
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
  commentButton,
  subtitle,
}: {
  state: "INCOMING" | "PENDING_APPROVAL" | "MATCHED" | "REJECTED";
  matches: MatchesWithMusicSubmission[];
  selectedMatchId: string | null;
  setSelectedMatchId: (matchId: string | null) => void;
  commentButton: ReactNode;
  subtitle: string;
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
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-row items-center justify-between gap-4 px-[20px]">
        <p className="text-dark-gray-500 dark:text-mint-200">{subtitle}</p>
        {commentButton}
      </div>
      {filteredMatches.length === 0 && (
        <div className="mt-16 flex w-full flex-col items-center gap-2">
          <>
            <div className="w-3/4 lg:w-1/2">
              <Hourglass size="large" className="h-auto w-full" />
            </div>
            <p className="text-dark-gray-500 dark:text-gray-200">
              No requests active at this time
            </p>
          </>
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
