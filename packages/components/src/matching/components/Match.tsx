import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";

import { formatAllCapsList } from "../../../utils/allCapsListFormatter";
import { MatchCard } from "../../base/MatchCard";

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

  return (
    <MatchCard
      title={
        match.musicSubmission.songName +
        " by " +
        match.musicSubmission.performerName
      }
      subtitle={"Genres: " + formatAllCapsList(match.musicSubmission.genres)}
      actionable={state === "SUGGESTED"}
      showActions={state === "SUGGESTED" && canApprove}
      contract={match.contract}
      onClick={() => onMatchClick(match)}
      onApprove={() =>
        updateMatchState.mutate({
          matchId: match.matchId,
          state: "SENT_TO_MEDIA_MAKER",
        })
      }
      onReject={() =>
        updateMatchState.mutate({
          matchId: match.matchId,
          state: "REJECTED_BY_MANAGER",
        })
      }
      approveDialog={{
        title: "Send to Media Maker?",
        text: "This action cannot be undone. This song will be sent to the Media Maker for approval.",
      }}
      rejectDialog={{
        title: "Want to deny this song?",
        text: "This action cannot be undone. If you want to re-add the song, someone will have to suggest it again.",
      }}
    />
  );
}
