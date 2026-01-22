import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { Check, X } from "lucide-react";
import { trpc } from "@good-dog/trpc/client";
import { useState } from "react";
import { formatAllCapsList } from "../../../utils/allCapsListFormatter";
import MusicNote from "./MusicNote";
import { Popup } from "./Popup";

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
      state: "SONG_REQUESTED",
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
      className={`flex flex-row justify-between items-center cursor-pointer w-[984px] box-content px-6 py-4 rounded-2xl border-[1px] shadow-md ${selected ? `border-light-green hover:border-good-dog-main` : `border-light-gray hover:border-gray`} ${state === "INCOMING" ? `bg-cream-100` : `bg-gray-200`}`}
      onClick={handleClick}
    >
      <div className="flex flex-row flex-shrink-0 items-center gap-4">
        <MusicNote />
        <div className="flex flex-col gap-2 w-[584px]">
          <p className="text-xl text-body-primary font-semibold truncate">
            {match.musicSubmission.songName} by {match.musicSubmission.performerName}
          </p>
          <p className="text-body-gray truncate">
            {"Genres: " + formatAllCapsList(match.musicSubmission.genres)}
          </p>
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
