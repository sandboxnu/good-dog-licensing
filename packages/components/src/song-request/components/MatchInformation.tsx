import { useState } from "react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { MatchState } from "@good-dog/db";

import { MatchesList } from "../../base/MatchesList";
import { MatchStatusTabs } from "../../base/MatchStatusTabs";
import { Match } from "./Match";
import MusicInformation from "./MusicInformation";

type SongRequestMatchesType =
  GetProcedureOutput<"getSongRequestById">["matches"];

export default function MatchInformation({
  matches,
}: {
  matches: SongRequestMatchesType;
}) {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const selectedMatch = matches.find((m) => m.matchId === selectedMatchId);

  const numActionRequired = matches.filter(
    (m) => m.matchState === MatchState.SENT_TO_MEDIA_MAKER,
  ).length;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-4xl text-dark-gray-500 dark:text-mint-300">
        Match Information
      </p>
      <div className="flex w-full flex-row gap-6">
        <div className="w-1/3 shrink-0">
          <MusicInformation
            musicSubmission={selectedMatch?.musicSubmission}
            submitter={selectedMatch?.musicSubmission.submitter}
          />
        </div>
        <div className="w-2/3 min-w-0">
          <MatchStatusTabs
            tabs={[
              {
                value: "incoming",
                label: "Incoming matches",
                badgeCount: numActionRequired,
                content: (
                  <MatchesList
                    matches={matches}
                    matchStates={[MatchState.SENT_TO_MEDIA_MAKER]}
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
                value: "pendingApproval",
                label: "Pending approval",
                content: (
                  <MatchesList
                    matches={matches}
                    matchStates={[MatchState.SENT_TO_MUSICIAN]}
                    renderMatch={(match) => (
                      <Match
                        state="PENDING_APPROVAL"
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
                    matchStates={[
                      MatchState.REJECTED_BY_MEDIA_MAKER,
                      MatchState.REJECTED_BY_MUSICIAN,
                    ]}
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
