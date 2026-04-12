import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { Check, FileText, X } from "lucide-react";
import { trpc } from "@good-dog/trpc/client";
import { useState } from "react";

import { formatAllCapsList } from "../../../utils/allCapsListFormatter";
import { ConfirmationModal } from "../ConfirmationModal";

type MatchWithMusicSubmission =
  GetProcedureOutput<"getSongRequestById">["matches"][number];

export function Match({
  state,
  match,
  projectManagerId,
  onMatchClick,
}: {
  state: "SUGGESTED" | "IN_PROGRESS" | "MATCHED" | "REJECTED";
  match: MatchWithMusicSubmission;
  projectManagerId: string | null;
  onMatchClick: (match: MatchWithMusicSubmission) => void;
}) {
  const [user] = trpc.user.useSuspenseQuery();

  const contract = match.contract;

  const canApprove =
    user?.userId === projectManagerId || user?.role === "ADMIN";

  const utils = trpc.useUtils();
  const updateMatchState = trpc.updateMatchState.useMutation({
    onSuccess: () => {
      void utils.getSongRequestById.invalidate({
        songRequestId: match.songRequestId,
      });
    },
  });

  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);

  const handleCheck: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setOpenApprove(true);
  };

  const handleX: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setOpenReject(true);
  };

  const handleApprove = () => {
    updateMatchState.mutate({
      matchId: match.matchId,
      state: "SENT_TO_MEDIA_MAKER",
    });
  };

  const handleReject = () => {
    updateMatchState.mutate({
      matchId: match.matchId,
      state: "REJECTED_BY_MANAGER",
    });
  };

  return (
    <div
      className={`box-content flex cursor-pointer flex-row items-center justify-between rounded-2xl border-[1px] border-light-gray px-6 py-4 shadow-md hover:border-gray ${state === "SUGGESTED" ? `bg-cream-100 dark:bg-green-300` : `bg-gray-200 dark:bg-green-500`}`}
      onClick={() => onMatchClick(match)}
    >
      <div className="flex min-w-0 flex-1 flex-row items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="text-body-primary truncate text-xl font-semibold dark:text-gray-200">
            {match.musicSubmission.songName} by{" "}
            {match.musicSubmission.performerName}
          </p>
          <p className="truncate text-body-gray dark:text-gray-200">
            {"Genres: " + formatAllCapsList(match.musicSubmission.genres)}
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        {contract && (
          <FileText
            onClick={() =>
              window.location.replace("/contract/" + contract.contractId)
            }
          />
        )}
        {state === "SUGGESTED" && canApprove && (
          <>
            <button type="button" onClick={handleCheck}>
              <Check className="hover:text-green-300 hover:bg-green-100 rounded-md dark:text-gray-200" />
            </button>
            <button type="button" onClick={handleX}>
              <X className="hover:text-required-star hover:bg-required-star/25 rounded-md dark:text-gray-200" />
            </button>
            <div onClick={(e) => e.stopPropagation()}>
              <ConfirmationModal
                open={openApprove}
                onOpenChange={setOpenApprove}
                onAction={handleApprove}
                type="approve"
                title={"Send to Media Maker?"}
                text={
                  "This action cannot be undone. This song will be sent to the Media Maker for approval."
                }
              />
              <ConfirmationModal
                open={openReject}
                onOpenChange={setOpenReject}
                onAction={handleReject}
                type="deny"
                title={"Want to deny this song?"}
                text={
                  "This action cannot be undone. If you want to re-add the song, someone will have to suggest it again."
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
