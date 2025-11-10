"use client";

import { FormProvider, useForm } from "react-hook-form";
import type z from "zod";
import { zMusicSubmissionValues } from "@good-dog/trpc/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { trpc } from "@good-dog/trpc/client";
import MusicSubmissionHeader from "./MusicSubmissionHeader";
import InitialMusicInfo from "./InitialMusicInfo";
import ContributorsInfo from "./ContributorsInfo";

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
    <div className="flex flex-col gap-4 items-center w-[752px]">
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
