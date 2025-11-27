"use client";

import type z from "zod";
import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zSongRequest } from "@good-dog/trpc/schema";

import SongRequestSubmissionHeader from "./SongRequestSubmissionHeader";
import SongRequestInfo from "./SongRequestInfo";

type SongRequestSubmissionFormFields = z.input<typeof zSongRequest>;

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

  const formMethods = useForm<SongRequestSubmissionFormFields>({
    resolver: zodResolver(zSongRequest),
    defaultValues: {
      songRequestTitle: "",
      description: "",
      feelingsConveyed: "",
      similarSongs: "",
      additionalInfo: "",
    },
  });

  const handleSubmit = formMethods.handleSubmit((data) => {
    submitSongRequestMutation.mutate({
      projectId: projectId,
      songRequest: data,
    });
  });

  const handleBack = useCallback(() => {
    window.location.replace(`/project/${projectId}/`);
  }, [projectId]);

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
