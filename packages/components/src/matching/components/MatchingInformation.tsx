import type { GetProcedureOutput } from "@good-dog/trpc/types";
import Button from "../../base/Button";
import { MatchStatusTabs } from "./MatchStatusTabs";
import { Matches } from "./Matches";
import { useState } from "react";
import { MusicSearchModal } from "./MusicSearchModal";
import { trpc } from "@good-dog/trpc/client";
import MatchDrawer from "./MatchDrawer";
import { MessageSquare } from "lucide-react";
import { Button as ButtonShad } from "@good-dog/ui/button";
import CommentsSheet from "../../song-request/components/CommentsSheet";

type SongRequestType = GetProcedureOutput<"getSongRequestById">;
type MusicSubmissionType = GetProcedureOutput<"allMusic">[number];
type MatchType = SongRequestType["matches"][number] | null;

export default function MatchingInformation({
  songRequest,
}: {
  songRequest: SongRequestType;
}) {
  const matches = songRequest.matches;

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
  const handleDoneSearch = (music: MusicSubmissionType[]) => {
    music.forEach((musicSubmission) => {
      createMatch.mutate({
        songRequestId: songRequest.songRequestId,
        musicId: musicSubmission.musicId,
      });
    });
  };

  const [selectedMatch, setSelectedMatch] = useState<MatchType>(null);

  const handleClickMatch = (match: MatchType) => {
    setSelectedMatch(match);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
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
        numActionRequired={
          matches.filter((m) => m.matchState === "WAITING_FOR_MANAGER_APPROVAL")
            .length
        }
        suggestions={
          <Matches
            state={"SUGGESTED"}
            matches={matches}
            projectManagerId={songRequest.projectSubmission.projectManagerId}
            onMatchClick={handleClickMatch}
          />
        }
        inProgress={
          <Matches
            state={"IN_PROGRESS"}
            matches={matches}
            projectManagerId={songRequest.projectSubmission.projectManagerId}
            onMatchClick={handleClickMatch}
          />
        }
        matched={
          <Matches
            state={"MATCHED"}
            matches={matches}
            projectManagerId={songRequest.projectSubmission.projectManagerId}
            onMatchClick={handleClickMatch}
          />
        }
        rejected={
          <Matches
            state={"REJECTED"}
            matches={matches}
            projectManagerId={songRequest.projectSubmission.projectManagerId}
            onMatchClick={handleClickMatch}
          />
        }
      />
      <MatchDrawer
        match={selectedMatch}
        open={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />
      <CommentsSheet
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        songRequestId={songRequest.songRequestId}
        comments={songRequest.comments}
      />
    </div>
  );
}
