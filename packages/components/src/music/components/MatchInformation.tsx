import type { ReactNode } from "react";
import { useState } from "react";

import { MatchState } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/client";

import { MatchesList } from "../../base/MatchesList";
import { MatchStatusTabs } from "../../base/MatchStatusTabs";
import { Match } from "./Match";
import ProjectInformation from "./ProjectInformation";
import SongRequestInformation from "./SongRequestInformation";

export default function MatchInformation({
  musicSubmissionId,
}: {
  musicSubmissionId: string;
}) {
  const [musicSubmission] = trpc.getMusicSubmissionById.useSuspenseQuery({
    musicId: musicSubmissionId,
  });
  const matches = musicSubmission.matches;

  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const selectedMatch = matches.find((m) => m.matchId === selectedMatchId);

  const numActionRequired = matches.filter(
    (m) => m.matchState === MatchState.SENT_TO_MUSICIAN,
  ).length;

  // On phones there's no room for the side panel, so the selected match's
  // details expand directly under its card instead.
  const withMobileDetails = (
    match: (typeof matches)[number],
    card: ReactNode,
  ) => (
    <div className="flex flex-col gap-3">
      {card}
      {match.matchId === selectedMatchId && (
        <div className="flex flex-col gap-3 md:hidden">
          <ProjectInformation
            projectSubmission={match.songRequest.projectSubmission}
            projectOwner={match.songRequest.projectSubmission.projectOwner}
          />
          <SongRequestInformation songRequest={match.songRequest} />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <p className="text-2xl text-dark-gray-500 md:text-4xl dark:text-mint-300">
        Match Information
      </p>
      <div className="flex w-full flex-row gap-6">
        <div className="hidden w-2/5 shrink-0 flex-col gap-3 md:flex">
          <ProjectInformation
            projectSubmission={selectedMatch?.songRequest.projectSubmission}
            projectOwner={
              selectedMatch?.songRequest.projectSubmission.projectOwner
            }
          />
          <SongRequestInformation songRequest={selectedMatch?.songRequest} />
        </div>
        <div className="w-full min-w-0 md:w-3/5">
          <p className="pb-3 text-dark-gray-500 md:hidden dark:text-gray-200">
            Tap a match to see its details.
          </p>
          <MatchStatusTabs
            tabs={[
              {
                value: "incoming",
                label: "Incoming matches",
                badgeCount: numActionRequired,
                content: (
                  <MatchesList
                    matches={matches}
                    matchStates={[MatchState.SENT_TO_MUSICIAN]}
                    headerHint="Review and approve/deny the songs matched below"
                    renderMatch={(match) =>
                      withMobileDetails(
                        match,
                        <Match
                          state="INCOMING"
                          match={match}
                          selectedMatchId={selectedMatchId}
                          setSelectedMatchId={setSelectedMatchId}
                        />,
                      )
                    }
                  />
                ),
              },
              {
                value: "matched",
                label: "Matched",
                content: (
                  <MatchesList
                    matches={matches}
                    matchStates={[MatchState.APPROVED_BY_MUSICIAN]}
                    renderMatch={(match) =>
                      withMobileDetails(
                        match,
                        <Match
                          state="MATCHED"
                          match={match}
                          selectedMatchId={selectedMatchId}
                          setSelectedMatchId={setSelectedMatchId}
                        />,
                      )
                    }
                  />
                ),
              },
              {
                value: "rejected",
                label: "Rejected",
                content: (
                  <MatchesList
                    matches={matches}
                    matchStates={[MatchState.REJECTED_BY_MUSICIAN]}
                    renderMatch={(match) =>
                      withMobileDetails(
                        match,
                        <Match
                          state="REJECTED"
                          match={match}
                          selectedMatchId={selectedMatchId}
                          setSelectedMatchId={setSelectedMatchId}
                        />,
                      )
                    }
                  />
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
