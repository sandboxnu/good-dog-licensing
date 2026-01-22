"use client";

import type z from "zod";
import { useFormContext } from "react-hook-form";

import type { zProjectSubmissionValues } from "@good-dog/trpc/schema";
import { ProjectType } from "@good-dog/db";

import { getProjectTypeLabel } from "../../../utils/enumLabelMapper";
import Button from "../../base/Button";
import RHFRadioGroup from "../../rhf-base/RHFRadioGroup";
import RHFTextArea from "../../rhf-base/RHFTextArea";
import RHFTextInput from "../../rhf-base/RHFTextInput";

interface InitialProjectInfoProps {
  onNext: () => void;
}

type ProjectSubmissionFormFields = z.input<typeof zProjectSubmissionValues>;

export default function InitialProjectInfo({
  onNext,
}: InitialProjectInfoProps) {
  const {
    formState: { errors },
    reset,
    getValues,
  } = useFormContext<ProjectSubmissionFormFields>();

  const handleClear = () => {
    const currentSongRequests = getValues("songRequests");

    reset({
      projectTitle: "",
      deadline: "",
      description: "",
      additionalInfo: "",
      songRequests: currentSongRequests,
    });
  };
  return (
    <form
      className="flex w-full flex-col gap-8"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <div className="flex w-full flex-col gap-6 rounded-2xl border-[.5px] border-gray-500 bg-gray-100 dark:bg-dark-gray-600 p-10 text-black">
        <p className="text-xl font-semibold text-semibold text-green-500 text-mint-200">
          Project information
        </p>
        <div className="flex flex-row gap-6">
          <RHFTextInput<ProjectSubmissionFormFields>
            rhfName="projectTitle"
            label="Title of Project"
            placeholder="Enter project title"
            id="projectTitle"
            errorText={errors.projectTitle?.message}
            required={true}
          />
          <RHFTextInput<ProjectSubmissionFormFields>
            rhfName="deadline"
            label="Project release date (estimate is okay)"
            placeholder="mm/dd/yyyy"
            id="deadline"
            errorText={errors.deadline?.message}
            required={true}
          />
        </div>
        <RHFRadioGroup<ProjectSubmissionFormFields>
          rhfName="projectType"
          label="Project Type"
          id="projectType"
          options={Object.values(ProjectType).map((type) => ({
            label: getProjectTypeLabel(type),
            value: type,
          }))}
          required
          errorText={errors.projectType?.message}
        />
        <RHFTextArea<ProjectSubmissionFormFields>
          rhfName="description"
          label="Project plot/description"
          placeholder="What is the project about?"
          id="description"
          errorText={errors.description?.message}
          required={true}
        />
        <RHFTextArea<ProjectSubmissionFormFields>
          rhfName="additionalInfo"
          label="Additional information (optional)"
          placeholder="Anything else we should know?"
          id="additionalInfo"
          errorText={errors.additionalInfo?.message}
          required={false}
        />
      </div>
      <div className="flex flex-row gap-4">
        <Button label="Next" type="submit" variant="contained" size="medium" />
        <Button
          type="button"
          label="Clear form"
          size="medium"
          variant="text"
          onClick={handleClear}
        />
      </div>
    </form>
  );
}
