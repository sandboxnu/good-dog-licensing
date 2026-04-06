import { useState } from "react";

import { trpc } from "@good-dog/trpc/client";

import { Matches } from "./Matches";
import { MatchStatusTabs } from "./MatchStatusTabs";
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

  return (
    <div className="flex flex-col gap-3">
      <p className="text-4xl text-dark-gray-500 dark:text-mint-300">
        Match Information
      </p>
      <div className="flex w-full flex-row gap-6">
        <div className="box-content flex w-[512px] flex-col gap-3">
          <ProjectInformation
            projectSubmission={selectedMatch?.songRequest.projectSubmission}
            projectOwner={
              selectedMatch?.songRequest.projectSubmission.projectOwner
            }
          />
          <SongRequestInformation songRequest={selectedMatch?.songRequest} />
        </div>
        <MatchStatusTabs
          numActionRequired={
            matches.filter((m) => m.matchState === "SENT_TO_MUSICIAN").length
          }
          incomingContent={
            <Matches
              state={"INCOMING"}
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
