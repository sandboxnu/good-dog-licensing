import { useState } from "react";
import { Check, X } from "lucide-react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";

import { ConfirmationModal } from "../../matching/ConfirmationModal";
import MusicNoteIcon from "../../svg/MusicNoteIcon";

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
      className={`flex flex-row justify-between items-center cursor-pointer w-full px-6 py-4 rounded-2xl border-[1px] shadow-md ${selected ? `border-green-300 hover:border-green-400 dark:border-grass-green-100 dark:hover:border-grass-green-200` : `border-cream-500 hover:border-gray`} ${state === "INCOMING" ? `bg-cream-100` : `bg-gray-200`}`}
      onClick={handleClick}
    >
      <div className="flex flex-row items-center gap-4 min-w-0 flex-1">
        <MusicNoteIcon />
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <p className="text-xl text-dark-gray-500 dark:text-mint-300 font-semibold truncate">
            {match.songRequest.songRequestTitle}
          </p>
          <p className="truncate text-dark-gray-200 dark:text-dark-gray-200">
            {match.songRequest.description}
          </p>
        </div>
      </div>
      {state === "INCOMING" && (
        <div className="flex flex-row gap-4">
          <button type="button" onClick={handleCheck}>
            <Check className="hover:text-mint-300/25 rounded-full text-dark-gray-300 hover:border hover:border-green-400 hover:bg-mint-300 dark:hover:border-mint-300 dark:hover:bg-mint-200" />
          </button>
          <button type="button" onClick={handleX}>
            <X className="rounded-md text-dark-gray-300 hover:bg-required-star/25 hover:text-required-star" />
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
        </div>
      )}
    </div>
  );
}
