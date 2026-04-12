import type { GetProcedureOutput } from "@good-dog/trpc/types";
import MusicNoteIcon from "../../svg/MusicNoteIcon";
import { Check, FileText, X } from "lucide-react";
import { trpc } from "@good-dog/trpc/client";
import { useState } from "react";

import { ConfirmationModal } from "../../matching/ConfirmationModal";

type MatchWithSongRequest =
  GetProcedureOutput<"getMusicSubmissionById">["matches"][number];

export function Match({
  state,
  match,
  selectedMatchId,
  setSelectedMatchId,
}: {
  state: "INCOMING" | "MATCHED" | "REJECTED";
  match: MatchWithSongRequest;
  selectedMatchId: string | null;
  setSelectedMatchId: (matchId: string | null) => void;
}) {
  const selected = match.matchId === selectedMatchId;
  const contract = match.contract;

  const handleClick = () => {
    if (selected) {
      setSelectedMatchId(null);
    } else {
      setSelectedMatchId(match.matchId);
    }
  };

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

  const utils = trpc.useUtils();
  const updateMatchState = trpc.updateMatchState.useMutation({
    onSuccess: () => {
      void utils.getMusicSubmissionById.invalidate({ musicId: match.musicId });
    },
  });

  const handleApprove = () => {
    updateMatchState.mutate({
      matchId: match.matchId,
      state: "APPROVED_BY_MUSICIAN",
    });
    setOpenApprove(false);
  };

  const handleReject = () => {
    updateMatchState.mutate({
      matchId: match.matchId,
      state: "REJECTED_BY_MUSICIAN",
    });
    setOpenReject(false);
  };

  return (
    <div
      className={`flex w-full cursor-pointer flex-row items-center justify-between rounded-2xl border-[1px] px-6 py-4 shadow-md ${selected ? `border-green-300 hover:border-green-400 dark:border-grass-green-100 dark:hover:border-grass-green-200` : `border-cream-500 hover:border-gray`} ${state === "INCOMING" ? `bg-cream-100` : `bg-gray-200`}`}
      onClick={handleClick}
    >
      <div className="flex min-w-0 flex-1 flex-row items-center gap-4">
        <MusicNoteIcon />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="truncate text-xl font-semibold text-dark-gray-500 dark:text-mint-300">
            {match.songRequest.songRequestTitle}
          </p>
          <p className="truncate text-dark-gray-200 dark:text-dark-gray-200">
            {match.songRequest.description}
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
        {state === "INCOMING" && (
          <>
            <button type="button" onClick={handleCheck}>
              <Check className="text-dark-gray-300 hover:text-mint-300/25 hover:bg-mint-300 dark:hover:bg-mint-200 rounded-full hover:border hover:border-green-400 dark:hover:border-mint-300" />
            </button>
            <button type="button" onClick={handleX}>
              <X className="text-dark-gray-300 hover:text-required-star hover:bg-required-star/25 rounded-md" />
            </button>
            <div onClick={(e) => e.stopPropagation()}>
              <ConfirmationModal
                open={openApprove}
                onOpenChange={setOpenApprove}
                onAction={handleApprove}
                type="approve"
                title={"Confirm match"}
                text={
                  "This action cannot be undone. This song will be matched following your approval."
                }
                showCheckbox={true}
              />
              <ConfirmationModal
                open={openReject}
                onOpenChange={setOpenReject}
                onAction={handleReject}
                type="deny"
                title={"Confirm selection"}
                text={
                  "This action cannot be undone. This song will be matched following your approval."
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
