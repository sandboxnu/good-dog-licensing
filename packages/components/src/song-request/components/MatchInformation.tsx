"use client";

import type { ReactNode } from "react";
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

  // On phones there's no room for the side panel, so the selected match's
  // details expand directly under its card instead.
  const withMobileDetails = (
    match: SongRequestMatchesType[number],
    card: ReactNode,
  ) => (
    <div className="flex flex-col gap-3">
      {card}
      {match.matchId === selectedMatchId && (
        <div className="md:hidden">
          <MusicInformation
            musicSubmission={match.musicSubmission}
            submitter={match.musicSubmission.submitter}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center justify-between gap-4">
        <p className="text-2xl text-dark-gray-500 md:text-4xl dark:text-mint-300">
          Match Information
        </p>
        <ButtonShad
          variant="outlined"
          size="small-text-with-icon"
          onClick={() => setCommentsOpen(true)}
          className="flex w-auto! flex-row items-center gap-1 border-dark-gray-500! bg-cream-100! px-3 text-green-500! hover:bg-cream-100! active:bg-cream-100! dark:border-dark-gray-300! dark:bg-green-700! dark:text-green-100! dark:hover:bg-green-700! dark:active:bg-green-700!"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Comment
        </ButtonShad>
      </div>
      <div className="flex w-full flex-row gap-6">
        <div className="hidden w-1/3 shrink-0 md:block">
          <MusicInformation
            musicSubmission={selectedMatch?.musicSubmission}
            submitter={selectedMatch?.musicSubmission.submitter}
          />
        </div>
        <div className="min-w-0 flex-1">
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
                    matchStates={[MatchState.SENT_TO_MEDIA_MAKER]}
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
                value: "pendingApproval",
                label: "Pending approval",
                content: (
                  <MatchesList
                    matches={matches}
                    matchStates={[MatchState.SENT_TO_MUSICIAN]}
                    renderMatch={(match) =>
                      withMobileDetails(
                        match,
                        <Match
                          state="PENDING_APPROVAL"
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
                    matchStates={[
                      MatchState.REJECTED_BY_MEDIA_MAKER,
                      MatchState.REJECTED_BY_MUSICIAN,
                    ]}
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
