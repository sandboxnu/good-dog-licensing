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
      "performerName",
    ]);
    if (initialMusicInfoIsValid) {
      setStep(SubmissionStep.CONTRIBUTORS);
    } else {
      console.log("Not valid");
    }
  };

  const handleSubmit = formMethods.handleSubmit((data) => {
    submitMusicMutation.mutate(data);
  });

  const handleBack = () => {
    setStep(SubmissionStep.INITIAL);
  };

  return (
    <div className="flex w-[752px] flex-col items-center gap-4">
      <MusicSubmissionHeader step={step} />
      <div className="flex w-full">
        <FormProvider {...formMethods}>
          {step == SubmissionStep.INITIAL && (
            <InitialMusicInfo onNext={handleNext} />
          )}
          {step == SubmissionStep.CONTRIBUTORS && (
            <ContributorsInfo onSubmit={handleSubmit} onBack={handleBack} />
          )}
        </FormProvider>
      </div>
    </div>
  );
}
