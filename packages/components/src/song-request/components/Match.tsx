import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { Check, FileText, X } from "lucide-react";
import { trpc } from "@good-dog/trpc/client";
import { useState } from "react";

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
  const contract = match.contract;

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
  const signContractLicensee = trpc.signContractLicensee.useMutation({
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

  const handleContract: React.MouseEventHandler<SVGSVGElement> = (e) => {
    e.stopPropagation();
    if (contract) {
      window.open("/contract/" + contract.contractId, "_blank");
    }
  };

  const handleApprove = () => {
    if (contract) {
      signContractLicensee.mutate({ contractId: contract.contractId });
      updateMatchState.mutate({
        matchId: match.matchId,
        state: "SENT_TO_MUSICIAN",
      });
    }
  };

  const handleReject = () => {
    updateMatchState.mutate({
      matchId: match.matchId,
      state: "REJECTED_BY_MEDIA_MAKER",
    });
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
            {match.musicSubmission.songName} by{" "}
            {match.musicSubmission.performerName}
          </p>
          <p className="truncate text-dark-gray-200 dark:text-dark-gray-200">
            {"Genres: " + formatAllCapsList(match.musicSubmission.genres)}
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        {contract && (
          <FileText
            className="dark:text-gray-200"
            onClick={handleContract}
          />
        )}
        {state === "INCOMING" && contract && (
          <>
            <button type="button" onClick={handleCheck}>
              <Check className="text-dark-gray-300 hover:text-mint-300/25 hover:bg-mint-300 dark:hover:bg-mint-200 rounded-full hover:border hover:border-green-400 dark:hover:border-mint-300" />
            </button>
            <button type="button" onClick={handleX}>
              <X className="text-dark-gray-300 hover:text-required-star hover:bg-required-star/25 rounded-md" />
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
                link={"/contract/" + contract.contractId}
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
          </>
        )}
      </div>
    </div>
  );
}
