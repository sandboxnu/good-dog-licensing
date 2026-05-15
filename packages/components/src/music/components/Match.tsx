import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";

import { MatchCard } from "../../base/MatchCard";

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
  const contract = match.contract;

  const utils = trpc.useUtils();
  const updateMatchState = trpc.updateMatchState.useMutation({
    onSuccess: () => {
      void utils.getMusicSubmissionById.invalidate({ musicId: match.musicId });
    },
  });

  const signContractLicensor = trpc.signContractLicensor.useMutation({
    onSuccess: () => {
      void utils.getMusicSubmissionById.invalidate({ musicId: match.musicId });
    },
  });

  return (
    <MatchCard
      title={match.songRequest.songRequestTitle}
      subtitle={match.songRequest.description}
      actionable={state === "INCOMING"}
      showActions={state === "INCOMING" && !!contract}
      contract={contract}
      selected={selected}
      onClick={() => setSelectedMatchId(selected ? null : match.matchId)}
      onApprove={() => {
        if (contract) {
          signContractLicensor.mutate({ contractId: contract.contractId });
          updateMatchState.mutate({
            matchId: match.matchId,
            state: "APPROVED_BY_MUSICIAN",
          });
        }
      }}
      onReject={() =>
        updateMatchState.mutate({
          matchId: match.matchId,
          state: "REJECTED_BY_MUSICIAN",
        })
      }
      approveDialog={{
        title: "Confirm match",
        text: "This action cannot be undone. This song will be matched following your approval.",
        showCheckbox: true,
        link: contract ? "/contract/" + contract.contractId : undefined,
      }}
      rejectDialog={{
        title: "Confirm selection",
        text: "This action cannot be undone. This song will be matched following your approval.",
      }}
    />
  );
}
