import { trpc } from "@good-dog/trpc/client";
import ProjectInformation from "./ProjectInformation";
import { useState } from "react";
import SongRequestInformation from "./SongRequestInformation";
import { MatchStatusTabs } from "./MatchStatusTabs";
import { Matches } from "./Matches";

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
      <p className="text-4xl">Match Information</p>
      <div className="flex flex-row gap-6 w-full">
        <div className="flex flex-col gap-3 w-[512px] box-content">
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
            matches.filter((m) => m.matchState === "SONG_REQUESTED").length
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
