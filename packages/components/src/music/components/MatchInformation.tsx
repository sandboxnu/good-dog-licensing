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

  return (
    <div className="flex flex-col gap-3">
      <p className="text-4xl text-dark-gray-500 dark:text-mint-300">
        Match Information
      </p>
      <div className="flex w-full flex-row gap-6">
        <div className="flex w-2/5 shrink-0 flex-col gap-3">
          <ProjectInformation
            projectSubmission={selectedMatch?.songRequest.projectSubmission}
            projectOwner={
              selectedMatch?.songRequest.projectSubmission.projectOwner
            }
          />
          <SongRequestInformation songRequest={selectedMatch?.songRequest} />
        </div>
        <div className="w-3/5 min-w-0">
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
                    renderMatch={(match) => (
                      <Match
                        state="INCOMING"
                        match={match}
                        selectedMatchId={selectedMatchId}
                        setSelectedMatchId={setSelectedMatchId}
                      />
                    )}
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
                    renderMatch={(match) => (
                      <Match
                        state="MATCHED"
                        match={match}
                        selectedMatchId={selectedMatchId}
                        setSelectedMatchId={setSelectedMatchId}
                      />
                    )}
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
                    renderMatch={(match) => (
                      <Match
                        state="REJECTED"
                        match={match}
                        selectedMatchId={selectedMatchId}
                        setSelectedMatchId={setSelectedMatchId}
                      />
                    )}
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
