"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { MatchState } from "@good-dog/db";
import { Button as ButtonShad } from "@good-dog/ui/button";

import { MatchesList } from "../../base/MatchesList";
import { MatchStatusTabs } from "../../base/MatchStatusTabs";
import CommentsSheet from "../../shared/comments/CommentsSheet";
import { Match } from "./Match";
import MusicInformation from "./MusicInformation";

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

  const numActionRequired = matches.filter(
    (m) => m.matchState === MatchState.SENT_TO_MEDIA_MAKER,
  ).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center justify-between">
        <p className="text-4xl text-dark-gray-500 dark:text-mint-300">
          Match Information
        </p>
        <ButtonShad
          variant="outlined"
          size="small-text-with-icon"
          onClick={() => setCommentsOpen(true)}
          className="flex flex-row items-center gap-1 !w-auto px-3 !bg-cream-100 !text-green-500 !border-dark-gray-500 hover:!bg-cream-100 active:!bg-cream-100 dark:!bg-green-700 dark:!text-green-100 dark:!border-dark-gray-300 dark:hover:!bg-green-700 dark:active:!bg-green-700"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Comment
        </ButtonShad>
      </div>
      <div className="flex w-full flex-row gap-6">
        <div className="w-1/3 shrink-0">
          <MusicInformation
            musicSubmission={selectedMatch?.musicSubmission}
            submitter={selectedMatch?.musicSubmission.submitter}
          />
        </div>
        <div className="flex-1 min-w-0">
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
      {commentsOpen && (
        <CommentsSheet
          open={true}
          onClose={() => setCommentsOpen(false)}
          songRequestId={songRequestId}
          comments={comments}
          subtitle="You can communicate with your project manager by commenting."
        />
      )}
    </div>
  );
}
