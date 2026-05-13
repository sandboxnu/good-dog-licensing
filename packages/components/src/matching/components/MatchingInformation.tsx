import { useState } from "react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { MatchState } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/client";

import Button from "../../base/Button";
import { MatchesList } from "../../base/MatchesList";
import { MatchStatusTabs } from "../../base/MatchStatusTabs";
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
  const handleDoneSearch = (music: MusicSubmissionType[]) => {
    music.forEach((musicSubmission) => {
      createMatch.mutate({
        songRequestId: songRequest.songRequestId,
        musicId: musicSubmission.musicId,
      });
    });
  };

  const [selectedMatch, setSelectedMatch] = useState<MatchType>(null);

  const numActionRequired = matches.filter(
    (m) => m.matchState === MatchState.WAITING_FOR_MANAGER_APPROVAL,
  ).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <p className="text-xl dark:text-gray-200">Song suggestions</p>
          <Button
            label={"Search for songs"}
            size={"small"}
            variant={"contained"}
            onClick={() => setOpenSearch(true)}
          />
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
    </div>
  );
}
