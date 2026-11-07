"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";

import type { MusicSubmissionFormFields } from "./MusicSubmissionWidget";
import Button from "../../base/Button";
import Modal from "../../base/Modal";
import MusicSubmissionWidget from "./MusicSubmissionWidget";

type PendingSubmission = GetProcedureOutput<"pendingMusicSubmissionForReview">;

/** Converts a stored submission back into the submission form's values. */
function toFormValues(
  submission: PendingSubmission,
): MusicSubmissionFormFields {
  const submitter = submission.contributors.find((c) => c.isSubmitter);
  const others = submission.contributors.filter((c) => !c.isSubmitter);

  return {
    songName: submission.songName,
    songLink: submission.songLink,
    genres: submission.genres,
    additionalInfo: submission.additionalInfo,
    songLyrics: submission.songLyrics,
    performerName: submission.performerName,
    submitterRoles: submitter?.roles ?? [],
    submitterAffiliation: submitter?.affiliation ?? undefined,
    submitterOtherAffiliationName: submitter?.otherAffiliationName ?? undefined,
    submitterIpi: submitter?.ipi ?? undefined,
    submitterPublisher: submitter?.publisher ?? undefined,
    submitterPublisherIpi: submitter?.publisherIpi ?? undefined,
    contributors: others.map((c) => ({
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email ?? undefined,
      roles: c.roles,
      affiliation: c.affiliation ?? undefined,
      otherAffiliationName: c.otherAffiliationName ?? undefined,
      ipi: c.ipi ?? undefined,
      publisher: c.publisher ?? undefined,
      publisherIpi: c.publisherIpi ?? undefined,
    })),
  };
}

/**
 * Lets a musician review a song an admin posted on their behalf. They can
 * edit it and approve it (making it available for matching) or decline it
 * (deleting it).
 */
export default function PendingSongReview({ musicId }: { musicId: string }) {
  // Once approved/declined the song is no longer pending and this query would
  // error, so don't refetch it while the form is open.
  const [submission] = trpc.pendingMusicSubmissionForReview.useSuspenseQuery(
    { musicId },
    { staleTime: Infinity, refetchOnWindowFocus: false },
  );
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const router = useRouter();
  const utils = trpc.useUtils();

  const declineMutation = trpc.declinePendingMusicSubmission.useMutation({
    onSuccess: async () => {
      await utils.userMusic.invalidate();
      router.push("/home");
    },
  });

  return (
    <div className="relative flex w-full justify-center">
      <MusicSubmissionWidget
        mode={{
          type: "review",
          musicId,
          defaultValues: toFormValues(submission),
          onDecline: () => setDeclineModalOpen(true),
        }}
      />
      <Modal
        open={declineModalOpen}
        onClose={() => setDeclineModalOpen(false)}
        headerText="Decline this song?"
        upperPadding={false}
        width={500}
        height={308}
        danger
      >
        <div className="flex w-full flex-col gap-4 pt-4 md:w-3/4">
          <div className="flex flex-col gap-[8px] text-dark-gray-500 dark:text-gray-300">
            {submission.songName} will be removed from Good Dog. The Good Dog
            team will be notified.
          </div>
          <div className="flex flex-row justify-center gap-2">
            <Button
              label="Decline Song"
              size="small"
              variant="contained"
              error
              disabled={declineMutation.isPending}
              onClick={() => declineMutation.mutate({ musicId })}
            />
            <Button
              label="Cancel"
              size="small"
              variant="outlined"
              onClick={() => setDeclineModalOpen(false)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
