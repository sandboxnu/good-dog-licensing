import { useState } from "react";
import { MessageSquare } from "lucide-react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { MatchState } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/client";
import { Button as ButtonShad } from "@good-dog/ui/button";

import Button from "../../base/Button";
import { MatchesList } from "../../base/MatchesList";
import { MatchStatusTabs } from "../../base/MatchStatusTabs";
import CommentsSheet from "../../shared/comments/CommentsSheet";
import MatchDrawer from "./MatchDrawer";
import { Match } from "./Match";
import { MusicSearchModal } from "./MusicSearchModal";

type SongRequestType = GetProcedureOutput<"getSongRequestById">;
type MusicSubmissionType = GetProcedureOutput<"allMusic">[number];
type MatchType = SongRequestType["matches"][number] | null;

export default function MatchingInformation({
  songRequest,
}: {
  songRequest: SongRequestType;
}) {
  const matches = songRequest.matches;
  const projectManagerId = songRequest.projectSubmission.projectManagerId;

  const utils = trpc.useContext();
  const createMatch = trpc.createMatch.useMutation({
    onSuccess: async () => {
      await utils.getSongRequestById.invalidate({
        songRequestId: songRequest.songRequestId,
      });
    },
  });

  const [openSearch, setOpenSearch] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchType>(null);

  const handleDoneSearch = (music: MusicSubmissionType[]) => {
    music.forEach((musicSubmission) => {
      createMatch.mutate({
        songRequestId: songRequest.songRequestId,
        musicId: musicSubmission.musicId,
      });
    });
  };

  const numActionRequired = matches.filter(
    (m) => m.matchState === MatchState.WAITING_FOR_MANAGER_APPROVAL,
  ).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <p className="text-xl dark:text-gray-200">Song suggestions</p>
          <div className="flex flex-row items-center gap-2">
            <Button
              label={"Search for songs"}
              size={"small"}
              variant={"contained"}
              onClick={() => setOpenSearch(true)}
            />
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
          <MusicSearchModal
            open={openSearch}
            onOpenChange={setOpenSearch}
            onAction={handleDoneSearch}
            matches={matches}
          />
        </div>
        <p className="dark:text-gray-200">
          Search for licensed songs and add them below as recommendations for
          media maker
        </p>
      </div>
      <MatchStatusTabs
        tabs={[
          {
            value: "incoming",
            label: "Suggestions",
            badgeCount: numActionRequired,
            content: (
              <MatchesList
                matches={matches}
                matchStates={[MatchState.WAITING_FOR_MANAGER_APPROVAL]}
                headerHint="Review and approve/deny the songs matched below"
                renderMatch={(match) => (
                  <Match
                    state="SUGGESTED"
                    match={match}
                    projectManagerId={projectManagerId}
                    onMatchClick={setSelectedMatch}
                  />
                )}
              />
            ),
          },
          {
            value: "pendingApproval",
            label: "In progress",
            content: (
              <MatchesList
                matches={matches}
                matchStates={[
                  MatchState.SENT_TO_MUSICIAN,
                  MatchState.SENT_TO_MEDIA_MAKER,
                ]}
                renderMatch={(match) => (
                  <Match
                    state="IN_PROGRESS"
                    match={match}
                    projectManagerId={projectManagerId}
                    onMatchClick={setSelectedMatch}
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
                    projectManagerId={projectManagerId}
                    onMatchClick={setSelectedMatch}
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
                  MatchState.REJECTED_BY_MANAGER,
                ]}
                renderMatch={(match) => (
                  <Match
                    state="REJECTED"
                    match={match}
                    projectManagerId={projectManagerId}
                    onMatchClick={setSelectedMatch}
                  />
                )}
              />
            ),
          },
        ]}
      />
      {selectedMatch && (
        <MatchDrawer
          match={selectedMatch}
          open={true}
          onClose={() => setSelectedMatch(null)}
        />
      )}
      {commentsOpen && (
        <CommentsSheet
          open={true}
          onClose={() => setCommentsOpen(false)}
          songRequestId={songRequest.songRequestId}
          comments={songRequest.comments}
          subtitle="You can communicate to media makers by commenting."
        />
      )}
    </div>
  );
}
