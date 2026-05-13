import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";

import { formatAllCapsList } from "../../../utils/allCapsListFormatter";
import { MatchCard } from "../../base/MatchCard";

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

  return (
    <MatchCard
      title={
        match.musicSubmission.songName +
        " by " +
        match.musicSubmission.performerName
      }
      subtitle={"Genres: " + formatAllCapsList(match.musicSubmission.genres)}
      actionable={state === "INCOMING"}
      showActions={state === "INCOMING" && !!contract}
      contract={contract}
      selected={selected}
      onClick={() => setSelectedMatchId(selected ? null : match.matchId)}
      onApprove={() => {
        if (contract) {
          signContractLicensee.mutate({ contractId: contract.contractId });
          updateMatchState.mutate({
            matchId: match.matchId,
            state: "SENT_TO_MUSICIAN",
          });
        }
      }}
      onReject={() =>
        updateMatchState.mutate({
          matchId: match.matchId,
          state: "REJECTED_BY_MEDIA_MAKER",
        })
      }
      approveDialog={{
        title: "Send to Musician?",
        text: "This action cannot be undone. This song will be sent to the Musician for approval.",
        showCheckbox: true,
        link: contract ? "/contract/" + contract.contractId : undefined,
      }}
      rejectDialog={{
        title: "Confirm selection",
        text: "This action cannot be undone. This match will be trashed following your denial.",
      }}
    />
  );
}
