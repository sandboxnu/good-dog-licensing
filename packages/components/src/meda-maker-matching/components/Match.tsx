import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { Check, ChevronRight, X } from "lucide-react";
import { trpc } from "@good-dog/trpc/client";
import { useState } from "react";
import { formatAllCapsList } from "../../../utils/allCapsListFormatter";

type MatchWithMusicSubmission =
  GetProcedureOutput<"getSongRequestById">["matches"][number];

export function Match({
  state,
  match,
}: {
  state: "INCOMING" | "PENDING_APPROVAL" | "MATCHED" | "REJECTED";
  match: MatchWithMusicSubmission;
}) {
  const utils = trpc.useUtils();
  const updateMatchState = trpc.updateMatchState.useMutation({
    onSuccess: () => {
      void utils.getSongRequestById.invalidate({
        songRequestId: match.songRequestId,
      });
    },
  });

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

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col px-6 py-4 rounded-2xl border-[1px] shadow-md border-light-gray hover:border-gray bg-cream-100 hover:cursor-pointer">
      <div
        className={"flex flex-row justify-between items-center box-content"}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="flex flex-row flex-shrink-0 items-center gap-4 justify-center">
          <ChevronRight
            className={`${!dropdownOpen ? "rotate-0" : "rotate-90"} transition-all`}
          />
          <p className="text-xl text-body-primary font-semibold truncate">
            {`"${match.musicSubmission.songName}" by ${match.musicSubmission.performerName}`}
          </p>
        </div>
        {state === "INCOMING" && (
          <div className="flex flex-row gap-4">
            <button type="button" onClick={handleApprove}>
              <Check className="hover:text-light-green hover:bg-light-green/25 rounded-md" />
            </button>
            <button type="button" onClick={handleReject}>
              <X className="hover:text-required-star hover:bg-required-star/25 rounded-md" />
            </button>
          </div>
        )}
      </div>
      {dropdownOpen && (
        <div className="grid grid-cols-2 gap-4 w-full p-4">
          <div className="flex flex-col gap-[6px] text-left">
            <p className="text-gray-500">Band Name</p>
            <p>{match.musicSubmission.performerName}</p>
          </div>
          <div className="flex flex-col gap-[6px] text-left">
            <p className="text-gray-500">Contributors</p>
            <p>
              {match.musicSubmission.contributors
                .map((c) => `${c.firstName} ${c.lastName}`)
                .join(", ")}
            </p>
          </div>
          <div className="flex flex-col gap-[6px] text-left">
            <p className="text-gray-500">Genre</p>
            <p>{formatAllCapsList(match.musicSubmission.genres)}</p>
          </div>
          <div className="flex flex-col gap-[6px] text-left">
            <p className="text-gray-500">Link</p>
            <a
              className="underline"
              href={match.musicSubmission.songLink}
              target="_blank"
            >
              View Song
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
