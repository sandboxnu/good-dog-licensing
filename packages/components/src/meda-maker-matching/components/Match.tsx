import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { Check, X } from "lucide-react";
import { trpc } from "@good-dog/trpc/client";

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
      className={
        "flex flex-row justify-between items-center w-[728px] box-content px-6 py-4 rounded-2xl border-[1px] shadow-md border-light-gray hover:border-gray bg-cream-100"
      }
    >
      <div className="flex flex-row flex-shrink-0 items-center gap-4">
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
  );
}
