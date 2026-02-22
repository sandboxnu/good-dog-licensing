import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { Check, X } from "lucide-react";
import { trpc } from "@good-dog/trpc/client";
import { useState } from "react";
import { formatAllCapsList } from "../../../utils/allCapsListFormatter";
import { ConfirmationModal } from "./ConfirmationModal";

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
      className={`flex flex-row justify-between items-center cursor-pointer box-content px-6 py-4 rounded-2xl border-[1px] shadow-md border-light-gray hover:border-gray ${state === "SUGGESTED" ? `bg-cream-100 dark:bg-green-300` : `bg-gray-200 dark:bg-green-500`}`}
      onClick={() => onMatchClick(match)}
    >
      <div className="flex flex-row flex-shrink-0 items-center gap-4">
        <div className="flex flex-col gap-2 w-[584px]">
          <p className="text-xl text-body-primary font-semibold truncate dark:text-gray-200">
            {match.musicSubmission.songName} by{" "}
            {match.musicSubmission.performerName}
          </p>
          <p className="text-body-gray truncate dark:text-gray-200">
            {"Genres: " + formatAllCapsList(match.musicSubmission.genres)}
          </p>
        </div>
      </div>
      {state === "SUGGESTED" && canApprove && (
        <div className="flex flex-row gap-4">
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
            />
            <ConfirmationModal
              open={openReject}
              onOpenChange={setOpenReject}
              onAction={handleReject}
              type="deny"
            />
          </div>
        </div>
      )}
    </div>
  );
}
