"use client";

import type z from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";
import { zMusicSubmissionValues } from "@good-dog/trpc/schema";

import Button from "../../base/Button";
import { ContributorsFields } from "./ContributorsInfo";
import { MusicInfoFields } from "./InitialMusicInfo";

type MusicSubmissionFormFields = z.input<typeof zMusicSubmissionValues>;
type MusicSubmission = GetProcedureOutput<"getMusicSubmissionById">;

/**
 * The song's stored contributors, split back into the shape the submission form
 * uses: the submitter's own row drives the `submitter*` fields, everyone else
 * fills the contributors array.
 */
const toFormValues = (
  submission: MusicSubmission,
): MusicSubmissionFormFields => {
  const submitter = submission.contributors.find(
    (contributor) => contributor.isSubmitter,
  );

  return {
    songName: submission.songName,
    songLink: submission.songLink,
    genres: submission.genres,
    additionalInfo: submission.additionalInfo,
    songLyrics: submission.songLyrics,
    performerName: submission.performerName,
    contributors: submission.contributors
      .filter((contributor) => !contributor.isSubmitter)
      .map((contributor) => ({
        firstName: contributor.firstName,
        lastName: contributor.lastName,
        roles: contributor.roles,
        email: contributor.email ?? undefined,
        affiliation: contributor.affiliation ?? undefined,
        ipi: contributor.ipi ?? undefined,
        publisher: contributor.publisher ?? undefined,
        publisherIpi: contributor.publisherIpi ?? undefined,
      })),
    submitterRoles: submitter?.roles ?? [],
    submitterAffiliation: submitter?.affiliation ?? undefined,
    submitterIpi: submitter?.ipi ?? undefined,
    submitterPublisher: submitter?.publisher ?? undefined,
    submitterPublisherIpi: submitter?.publisherIpi ?? undefined,
  };
};

/**
 * Staff-only edit form for a song submission. Same fields as the submission
 * flow, but on a single page and phrased around the musician who submitted it.
 */
export default function MusicEditWidget({ musicId }: { musicId: string }) {
  const router = useRouter();

  const [submission] = trpc.getMusicSubmissionById.useSuspenseQuery({
    musicId,
  });

  const utils = trpc.useUtils();
  const updateMusicMutation = trpc.updateMusicSubmission.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.getMusicSubmissionById.invalidate({ musicId }),
        utils.allMusic.invalidate(),
      ]);
      router.push(`/song/${musicId}`);
    },
  });

  const formMethods = useForm<MusicSubmissionFormFields>({
    resolver: zodResolver(zMusicSubmissionValues),
    defaultValues: toFormValues(submission),
  });

  const handleSubmit = formMethods.handleSubmit((data) => {
    updateMusicMutation.mutate({ ...data, musicId });
  });

  const submitterName = `${submission.submitter.firstName} ${submission.submitter.lastName}`;

  return (
    <div className="flex w-[752px] flex-col items-center gap-4">
      <div className="flex w-full flex-col gap-2 rounded-2xl border-[.5px] border-gray-500 bg-gray-100 px-10 py-6 dark:bg-dark-gray-600">
        <p className="text-5xl font-medium text-green-500 dark:text-mint-200">
          Edit song submission
        </p>
        <p className="text-lg font-medium text-dark-gray-500 dark:text-gray-200">
          {submission.songName} — submitted by {submitterName}
        </p>
        <p className="font-semibold text-required-star">
          * Indicates a required question.
        </p>
      </div>
      <FormProvider {...formMethods}>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
        >
          <MusicInfoFields />
          <ContributorsFields
            prefill={null}
            submitterSectionTitle={`${submitterName}'s Contributions`}
            submitterQuestions={{
              roles: "What was their role in the song?",
              affiliation: "Are they affiliated with ASCAP or BMI?",
              ipi: "What is their Interested Party Information (IPI)?",
            }}
            actions={
              <>
                <Button
                  label="Save changes"
                  type="submit"
                  variant="contained"
                  size="medium"
                  disabled={updateMusicMutation.isPending}
                />
                <Button
                  type="button"
                  label="Cancel"
                  size="medium"
                  variant="text"
                  onClick={() => router.push(`/song/${musicId}`)}
                />
              </>
            }
          />
        </form>
      </FormProvider>
    </div>
  );
}
