"use client";

import type z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zSongRequest } from "@good-dog/trpc/schema";

import SongRequestSubmissionHeader from "./SongRequestSubmissionHeader";
import SongRequestInfo from "./SongRequestInfo";

type ProjectSubmissionFormFields = z.input<typeof zSongRequest>;

export enum SubmissionStep {
  INFO,
  SUBMITTED,
}

export default function SongRequestSubmissionWidget({
  projectId,
}: {
  projectId: string;
}) {
  const [step, setStep] = useState<SubmissionStep>(SubmissionStep.INFO);

  const submitSongRequestMutation = trpc.songRequestSubmission.useMutation({
    onSuccess: () => {
      setStep(SubmissionStep.SUBMITTED);
    },
  });

  const formMethods = useForm<ProjectSubmissionFormFields>({
    resolver: zodResolver(zSongRequest),
    defaultValues: {
      description: "",
      feelingsConveyed: "",
      similarSongs: "",
      additionalInfo: "",
    },
  });

  const handleSubmit = async () => {
    const songRequestInfoIsValid = await formMethods.trigger();
    if (songRequestInfoIsValid) {
      submitSongRequestMutation.mutate({
        projectId: projectId,
        songRequest: formMethods.getValues(),
      });
    } else {
      console.log("Not valid");
    }
  };

  const handleBack = () => {
    window.location.replace(`/project/${projectId}/`);
  };

  return (
    <div className="flex w-[752px] flex-col items-center gap-4">
      <SongRequestSubmissionHeader step={step} projectId={projectId} />
      <div className="flex w-full">
        <FormProvider {...formMethods}>
          {step == SubmissionStep.INFO && (
            <SongRequestInfo onSubmit={handleSubmit} onBack={handleBack} />
          )}
        </FormProvider>
      </div>
    </div>
  );
}
