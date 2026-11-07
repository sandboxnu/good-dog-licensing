"use client";

import type z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zMusicSubmissionValues } from "@good-dog/trpc/schema";

import ContributorsInfo from "./ContributorsInfo";
import InitialMusicInfo from "./InitialMusicInfo";
import MusicSubmissionHeader from "./MusicSubmissionHeader";

export type MusicSubmissionFormFields = z.input<typeof zMusicSubmissionValues>;

export enum SubmissionStep {
  INITIAL,
  CONTRIBUTORS,
  SUBMITTED,
}

/**
 * The same form is used for three flows:
 * - "musician": a musician submitting their own song (default)
 * - "admin": an admin posting a song on a musician's behalf. It is saved as
 *   waiting for that musician's review.
 * - "review": a musician reviewing (and optionally editing) a song an admin
 *   posted for them, then approving or declining it
 */
export type MusicSubmissionMode =
  | { type: "musician" }
  | {
      type: "admin";
      musician: { userId: string; firstName: string; lastName: string };
    }
  | {
      type: "review";
      musicId: string;
      defaultValues: MusicSubmissionFormFields;
      onDecline: () => void;
    };

export default function MusicSubmissionWidget({
  mode = { type: "musician" },
}: {
  mode?: MusicSubmissionMode;
}) {
  const [step, setStep] = useState<SubmissionStep>(SubmissionStep.INITIAL);

  const utils = trpc.useUtils();

  const onSuccess = () => {
    setStep(SubmissionStep.SUBMITTED);
    void utils.userMusic.invalidate();
    void utils.allMusic.invalidate();
    void utils.pendingMusicForMusicians.invalidate();
  };

  const submitMusicMutation = trpc.submitMusic.useMutation({ onSuccess });
  const adminSubmitMutation = trpc.adminSubmitMusicForMusician.useMutation({
    onSuccess,
  });
  const approveMutation = trpc.approvePendingMusicSubmission.useMutation({
    onSuccess,
  });

  const formMethods = useForm<MusicSubmissionFormFields>({
    resolver: zodResolver(zMusicSubmissionValues),
    defaultValues:
      mode.type === "review"
        ? mode.defaultValues
        : {
            submitterRoles: [],
            contributors: [],
          },
  });

  const handleNext = async () => {
    const initialMusicInfoIsValid = await formMethods.trigger([
      "songName",
      "songLink",
      "genres",
      "additionalInfo",
      "songLyrics",
      "performerName",
    ]);
    if (initialMusicInfoIsValid) {
      setStep(SubmissionStep.CONTRIBUTORS);
    } else {
      console.log("Not valid");
    }
  };

  const handleSubmit = formMethods.handleSubmit((data) => {
    switch (mode.type) {
      case "musician":
        submitMusicMutation.mutate(data);
        break;
      case "admin":
        adminSubmitMutation.mutate({
          musicianId: mode.musician.userId,
          submission: data,
        });
        break;
      case "review":
        approveMutation.mutate({ musicId: mode.musicId, submission: data });
        break;
    }
  });

  const handleBack = () => {
    setStep(SubmissionStep.INITIAL);
  };

  const isSubmitting =
    submitMusicMutation.isPending ||
    adminSubmitMutation.isPending ||
    approveMutation.isPending;

  return (
    <div className="flex w-full max-w-[752px] flex-col items-center gap-4">
      <MusicSubmissionHeader step={step} mode={mode} />
      <div className="flex w-full">
        <FormProvider {...formMethods}>
          {step == SubmissionStep.INITIAL && (
            <InitialMusicInfo onNext={handleNext} />
          )}
          {step == SubmissionStep.CONTRIBUTORS && (
            <ContributorsInfo
              onSubmit={handleSubmit}
              onBack={handleBack}
              musicianId={
                mode.type === "admin" ? mode.musician.userId : undefined
              }
              submitLabel={
                mode.type === "review"
                  ? "Approve & Submit"
                  : mode.type === "admin"
                    ? "Send to Musician for Review"
                    : "Submit"
              }
              submitDisabled={isSubmitting}
              onDecline={mode.type === "review" ? mode.onDecline : undefined}
              prefilled={mode.type === "review"}
            />
          )}
        </FormProvider>
      </div>
    </div>
  );
}
