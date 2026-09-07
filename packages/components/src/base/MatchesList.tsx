import type { ReactNode } from "react";
import { Fragment } from "react";

import type { MatchState } from "@good-dog/db";

import Hourglass from "../svg/Hourglass";

export function MatchesList<
  T extends { matchId: string; matchState: MatchState },
>({
  matches,
  matchStates,
  headerHint,
  renderMatch,
}: {
  matches: T[];
  matchStates: MatchState[];
  headerHint?: ReactNode;
  renderMatch: (match: T) => ReactNode;
}) {
  const filteredMatches = matches.filter((m) =>
    matchStates.includes(m.matchState),
  );

  return (
    <div className="flex flex-col gap-4">
      {filteredMatches.length > 0 && headerHint && (
        <p className="w-full text-dark-gray-500 dark:text-mint-200">
          {headerHint}
        </p>
      )}
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
        <Fragment key={match.matchId}>{renderMatch(match)}</Fragment>
      ))}
    </div>
  );
}
