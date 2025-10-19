"use client";

import type { zProjectSubmissionValues } from "@good-dog/trpc/schema";
import { useFormContext } from "react-hook-form";
import type z from "zod";
import RHFTextInput from "../../rhf-base/RHFTextInput";
import RHFTextArea from "../../rhf-base/RHFTextArea";
import Button from "../../base/Button";

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
  } = useFormContext<ProjectSubmissionFormFields>();
  return (
    <form
      className="flex flex-col gap-8 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <div className="w-full text-black border-[.5px] bg-white py-6 px-10 gap-6 flex flex-col border-black rounded-2xl">
        <p className="font-semibold text-xl">Project information</p>
        <div className="flex flex-row gap-6">
          <RHFTextInput<ProjectSubmissionFormFields>
            rhfName="projectTitle"
            label="Project Title"
            placeholder="Enter project title"
            id="projectTitle"
            errorText={errors.projectTitle?.message}
            required={true}
          />
          <RHFTextInput<ProjectSubmissionFormFields>
            rhfName="deadline"
            label="Project deadline"
            placeholder="mm/dd/yyyy"
            id="deadline"
            errorText={errors.deadline?.message}
            required={true}
          />
        </div>
        <RHFTextArea<ProjectSubmissionFormFields>
          rhfName="description"
          label="Project description"
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
        <Button
          label="Next"
          type="submit"
          variant="contained"
          size="medium"
          onClick={onNext}
        />
        <Button
          type="button"
          label="Clear form"
          size="medium"
          variant="text"
          onClick={() => reset()}
        />
      </div>
    </form>
  );
}
