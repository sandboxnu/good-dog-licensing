"use client";

import type { GetProcedureOutput } from "@good-dog/trpc/types";

import { Matches } from "./Matches";
import { MatchStatusTabs } from "./MatchStatusTabs";
import MusicInformation from "./MusicInformation";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button as ButtonShad } from "@good-dog/ui/button";
import CommentsSheet from "./CommentsSheet";

type SongRequestType = GetProcedureOutput<"getSongRequestById">;
type SongRequestMatchesType = SongRequestType["matches"];
type CommentsType = SongRequestType["comments"];

export default function MatchInformation({
  matches,
  songRequestId,
  comments,
}: {
  matches: SongRequestMatchesType;
  songRequestId: string;
  comments: CommentsType;
}) {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const selectedMatch = matches.find((m) => m.matchId === selectedMatchId);

  const commentButton = (
    <ButtonShad
      variant="outlined"
      size="small-text-with-icon"
      onClick={() => setCommentsOpen(true)}
      className="flex flex-row items-center gap-1 !w-auto px-3 !bg-cream-100 !text-green-500 !border-dark-gray-500 hover:!bg-cream-100 active:!bg-cream-100 dark:!bg-green-700 dark:!text-green-100 dark:!border-dark-gray-300 dark:hover:!bg-green-700 dark:active:!bg-green-700"
    >
      <MessageSquare className="h-3.5 w-3.5" />
      Comment
    </ButtonShad>
  );

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
        <MatchStatusTabs
          numActionRequired={
            matches.filter((m) => m.matchState === "SENT_TO_MEDIA_MAKER").length
          }
          incomingContent={
            <Matches
              state={"INCOMING"}
              matches={matches}
              selectedMatchId={selectedMatchId}
              setSelectedMatchId={setSelectedMatchId}
              commentButton={commentButton}
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
      <CommentsSheet
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        songRequestId={songRequestId}
        comments={comments}
        subtitle="You can communicate with your project manager by commenting."
      />
    </div>
  );
}
