import { GetProcedureOutput } from "@good-dog/trpc/types";
import { MatchStatusTabs } from "./MatchStatusTabs";
import { ListOfMatches } from "./ListOfMatches";

type SongRequestMatchesType =
  GetProcedureOutput<"getSongRequestById">["matches"];

export default function MatchesSection({
  matches,
}: {
  matches: SongRequestMatchesType;
}) {
  return (
    <div className="flex flex-col gap-4">
      <MatchStatusTabs
        numActionRequired={matches.filter((m) => m.matchState === "NEW").length}
        incomingContent={<ListOfMatches state={"INCOMING"} matches={matches} />}
        pendingApprovalContent={
          <ListOfMatches state={"PENDING_APPROVAL"} matches={matches} />
        }
        matchedContent={<ListOfMatches state={"MATCHED"} matches={matches} />}
        rejectedContent={<ListOfMatches state={"REJECTED"} matches={matches} />}
      />
    </div>
  );
}
