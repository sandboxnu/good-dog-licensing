import { useState } from "react";
import { Check, X } from "lucide-react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";

import { formatAllCapsList } from "../../../utils/allCapsListFormatter";
import { ConfirmationModal } from "../../matching/ConfirmationModal";
import MusicNoteIcon from "../../svg/MusicNoteIcon";

type MatchWithMusicSubmission =
  GetProcedureOutput<"getSongRequestById">["matches"][number];

export function Match({
  state,
  match,
  selectedMatchId,
  setSelectedMatchId,
}: {
  state: "INCOMING" | "PENDING_APPROVAL" | "MATCHED" | "REJECTED";
  match: MatchWithMusicSubmission;
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
      state: "SENT_TO_MUSICIAN",
    });
  };

  const handleReject = () => {
    updateMatchState.mutate({
      matchId: match.matchId,
      state: "REJECTED_BY_MEDIA_MAKER",
    });
  };

  return (
    <div
      className={`box-content flex w-[984px] cursor-pointer flex-row items-center justify-between rounded-2xl border-[1px] bg-cream-100 px-6 py-4 shadow-md dark:bg-green-500 ${selected ? `border-green-300 hover:border-green-400 dark:border-grass-green-100 dark:hover:border-grass-green-200` : `border-cream-500 hover:border-gray`} ${state === "INCOMING" ? `bg-cream-100` : `bg-gray-200`}`}
      onClick={handleClick}
    >
      <div className="flex flex-shrink-0 flex-row items-center gap-4">
        <MusicNoteIcon />
        <div className="flex w-[584px] flex-col gap-2">
          <p className="truncate text-xl font-semibold text-dark-gray-500 dark:text-mint-300">
            {match.musicSubmission.songName} by{" "}
            {match.musicSubmission.performerName}
          </p>
          <p className="truncate text-dark-gray-200 dark:text-dark-gray-200">
            {"Genres: " + formatAllCapsList(match.musicSubmission.genres)}
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
              title={"Send to Musician?"}
              open={openApprove}
              onOpenChange={setOpenApprove}
              onAction={handleApprove}
              type="approve"
              text={
                "This action cannot be undone. This song will be sent to the Musician for approval."
              }
              showCheckbox={true}
            />
            <ConfirmationModal
              title={"Confirm selection"}
              open={openReject}
              onOpenChange={setOpenReject}
              onAction={handleReject}
              type="deny"
              text="This action cannot be undone. This match will be trashed following your denial."
            />
          </div>
        </div>
      )}
    </div>
  );
}
