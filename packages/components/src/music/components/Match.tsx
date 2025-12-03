import type { GetProcedureOutput } from "@good-dog/trpc/types";
import MusicNote from "./MusicNote";
import { Check, X } from "lucide-react";
import { trpc } from "@good-dog/trpc/client";
import { useState } from "react";
import { Popup } from "./Popup";

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

  const utils = trpc.useContext();
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
      className={`flex flex-row justify-between items-center cursor-pointer bg-gray-200 w-[728px] box-content px-6 py-4 rounded-2xl border-[1px] shadow-md ${selected ? `border-light-green` : `border-light-gray`}`}
      onClick={handleClick}
    >
      <div className="flex flex-row items-center gap-4">
        <MusicNote />
        <div className="flex flex-col gap-2">
          <p className="text-xl text-body-primary font-semibold">
            {match.songRequest.songRequestTitle}
          </p>
          <p className="text-body-gray">{match.songRequest.description}</p>
        </div>
      </div>
      {state === "INCOMING" && (
        <div className="flex flex-row gap-4">
          <button type="button" onClick={handleCheck}>
            <Check className="hover:text-light-green hover:bg-light-green/25 rounded-md" />
          </button>
          <button type="button" onClick={handleX}>
            <X className="hover:text-required-star hover:bg-required-star/25 rounded-md" />
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <Popup
              open={openApprove}
              onOpenChange={setOpenApprove}
              onAction={handleApprove}
              type="approve"
            />
            <Popup
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
