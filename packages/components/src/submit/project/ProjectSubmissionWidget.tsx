"use client";

import type z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zProjectSubmissionValues } from "@good-dog/trpc/schema";

import InitialProjectInfo from "./InitialProjectInfo";
import ProjectSubmissionHeader from "./ProjectSubmissionHeader";
import SongRequestsInfo from "./SongRequestsInfo";

type ProjectSubmissionFormFields = z.input<typeof zProjectSubmissionValues>;

export enum SubmissionStep {
  INITIAL,
  SONG_REQUESTS,
  SUBMITTED,
}

export default function ProjectSubmissionWidget() {
  const [step, setStep] = useState<SubmissionStep>(SubmissionStep.INITIAL);

  const submitProjectMutation = trpc.projectSubmission.useMutation({
    onSuccess: () => {
      setStep(SubmissionStep.SUBMITTED);
    },
  });

  const formMethods = useForm<ProjectSubmissionFormFields>({
    resolver: zodResolver(zProjectSubmissionValues),
    defaultValues: {
      songRequests: [
        {
          oneLineSummary: "",
          description: "",
          musicType: "",
          similarSongs: "",
          additionalInfo: "",
        },
      ],
    },
  });

  const handleNext = async () => {
    const initialProjectInfoIsValid = await formMethods.trigger([
      "projectTitle",
      "description",
      "deadline",
    ]);
    if (initialProjectInfoIsValid) {
      setStep(SubmissionStep.SONG_REQUESTS);
    } else {
      console.log("Not valid");
    }
  };

  const handleSubmit = async () => {
    const songRequestsInfoIsValid = await formMethods.trigger(["songRequests"]);
    if (songRequestsInfoIsValid) {
      submitProjectMutation.mutate(formMethods.getValues());
    } else {
      console.log("Not valid");
    }
  };

  const handleBack = () => {
    setStep(SubmissionStep.INITIAL);
  };

  return (
    <div className="flex w-[752px] flex-col items-center gap-4">
      <ProjectSubmissionHeader step={step} />
      <div className="flex w-full">
        <FormProvider {...formMethods}>
          {step == SubmissionStep.INITIAL && (
            <InitialProjectInfo onNext={handleNext} />
          )}
          {step == SubmissionStep.SONG_REQUESTS && (
            <SongRequestsInfo onSubmit={handleSubmit} onBack={handleBack} />
          )}
        </FormProvider>
      </div>
    </div>
  );
}
