import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { MatchStatusTabs } from "./MatchStatusTabs";
import { Matches } from "./Matches";
import MusicInformation from "./MusicInformation";
import { useState } from "react";

type SongRequestMatchesType =
  GetProcedureOutput<"getSongRequestById">["matches"];

export default function MatchInformation({
  matches,
}: {
  matches: SongRequestMatchesType;
}) {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const selectedMatch = matches.find((m) => m.matchId === selectedMatchId);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-4xl">Match Information</p>
      <div className="flex flex-row gap-6 w-full">
        <div className="w-[512px] box-content">
          <MusicInformation
            musicSubmission={selectedMatch?.musicSubmission}
            submitter={selectedMatch?.musicSubmission.submitter}
          />
        </div>
        <MatchStatusTabs
          numActionRequired={
            matches.filter((m) => m.matchState === "NEW").length
          }
          incomingContent={
            <Matches
              state={"INCOMING"}
              matches={matches}
              selectedMatchId={selectedMatchId}
              setSelectedMatchId={setSelectedMatchId}
            />
          }
          pendingApprovalContent={
            <Matches
              state={"PENDING_APPROVAL"}
              matches={matches}
              selectedMatchId={selectedMatchId}
              setSelectedMatchId={setSelectedMatchId}
            />
          }
          matchedContent={
            <Matches
              state={"MATCHED"}
              matches={matches}
              selectedMatchId={selectedMatchId}
              setSelectedMatchId={setSelectedMatchId}
            />
          }
          rejectedContent={
            <Matches
              state={"REJECTED"}
              matches={matches}
              selectedMatchId={selectedMatchId}
              setSelectedMatchId={setSelectedMatchId}
            />
          }
        />
      </div>
    </div>
  );
}
