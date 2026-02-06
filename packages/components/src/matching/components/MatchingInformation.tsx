import type { GetProcedureOutput } from "@good-dog/trpc/types";
import Button from "../../base/Button";
import { MatchStatusTabs } from "./MatchStatusTabs";
import { Matches } from "./Matches";

type SongRequestType = GetProcedureOutput<"getSongRequestById">;

export default function MatchingInformation({
  songRequest,
}: {
  songRequest: SongRequestType;
}) {
  const matches = songRequest.matches;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <p className="text-xl">Song suggestions</p>
          <Button
            label={"Search for songs"}
            size={"small"}
            variant={"contained"}
          />
        </div>
        <p>
          Search for licensed songs and add them below as recommendations for
          media maker
        </p>
      </div>
      <MatchStatusTabs
        numActionRequired={
          matches.filter((m) => m.matchState === "WAITING_FOR_MANAGER_APPROVAL")
            .length
        }
        suggestions={
          <Matches
            state={"SUGGESTED"}
            matches={matches}
            projectManagerId={songRequest.projectSubmission.projectManagerId}
          />
        }
        inProgress={
          <Matches
            state={"IN_PROGRESS"}
            matches={matches}
            projectManagerId={songRequest.projectSubmission.projectManagerId}
          />
        }
        matched={
          <Matches
            state={"MATCHED"}
            matches={matches}
            projectManagerId={songRequest.projectSubmission.projectManagerId}
          />
        }
        rejected={
          <Matches
            state={"REJECTED"}
            matches={matches}
            projectManagerId={songRequest.projectSubmission.projectManagerId}
          />
        }
      />
    </div>
  );
}
