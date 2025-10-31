"use client";

import { FormProvider, useForm } from "react-hook-form";
import type z from "zod";
import { zMusicSubmissionValues } from "@good-dog/trpc/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { trpc } from "@good-dog/trpc/client";
import MusicSubmissionHeader from "./MusicSubmissionHeader";
import InitialMusicInfo from "./InitialMusicInfo";

type MusicSubmissionFormFields = z.input<typeof zMusicSubmissionValues>;

export enum SubmissionStep {
  INITIAL,
  CONTRIBUTORS,
  SUBMITTED,
}

export default function MusicSubmissionWidget() {
  const [step, setStep] = useState<SubmissionStep>(SubmissionStep.INITIAL);

  const submitMusicMutation = trpc.submitMusic.useMutation({
    onSuccess: () => {
      setStep(SubmissionStep.SUBMITTED);
    },
  });

  const formMethods = useForm<MusicSubmissionFormFields>({
    resolver: zodResolver(zMusicSubmissionValues),
    defaultValues: {
      contributors: [{}],
    },
  });

  const handleNext = async () => {
    const initialProjectInfoIsValid = await formMethods.trigger([
      "songName",
      "songLink",
      "genre",
      "additionalInfo",
      "performerName",
    ]);
    if (initialProjectInfoIsValid) {
      setStep(SubmissionStep.CONTRIBUTORS);
    } else {
      console.log("Not valid");
    }
  };

  const handleSubmit = async () => {
    const songRequestsInfoIsValid = await formMethods.trigger(["contributors"]);
    if (songRequestsInfoIsValid) {
      submitMusicMutation.mutate(formMethods.getValues());
    } else {
      console.log("Not valid");
    }
  };

  const handleBack = () => {
    setStep(SubmissionStep.INITIAL);
  };

  return (
    <div className="flex flex-col gap-4 items-center w-[752px]">
      <MusicSubmissionHeader step={step} />
      <div className="flex w-full">
        <FormProvider {...formMethods}>
          {step == SubmissionStep.INITIAL && (
            <InitialMusicInfo onNext={handleNext} />
          )}
          {/* {step == SubmissionStep.SONG_REQUESTS && (
            <SongRequestsInfo onSubmit={handleSubmit} onBack={handleBack} />
          )} */}
        </FormProvider>
      </div>
    </div>
  );
}
