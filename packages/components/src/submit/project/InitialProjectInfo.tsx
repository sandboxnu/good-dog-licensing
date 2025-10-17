"use client";

import type { zProjectSubmissionValues} from "@good-dog/trpc/schema";
import { useFormContext } from "react-hook-form";
import type z from "zod";
import RHFTextInput from "../../rhf-base/RHFTextInput";
import RHFTextArea from "../../rhf-base/RHFTextArea";

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
            errorText={
              errors.projectTitle ? errors.projectTitle.message : undefined
            }
            required={true}
          />
          <RHFTextInput<ProjectSubmissionFormFields>
            rhfName="deadline"
            label="Project deadline"
            placeholder="mm/dd/yyyy"
            id="deadline"
            errorText={errors.deadline ? errors.deadline.message : undefined}
            required={true}
          />
        </div>
        <RHFTextArea<ProjectSubmissionFormFields>
          rhfName="description"
          label="Project description"
          placeholder="What is the project about?"
          id="description"
          errorText={
            errors.description ? errors.description.message : undefined
          }
          required={true}
        />
        <RHFTextArea<ProjectSubmissionFormFields>
          rhfName="additionalInfo"
          label="Additional information (optional)"
          placeholder="Anything else we should know?"
          id="additionalInfo"
          errorText={
            errors.additionalInfo ? errors.additionalInfo.message : undefined
          }
          required={false}
        />
      </div>
      <div className="flex flex-row gap-4">
        <button type="submit" className="w-28 h-10 rounded-lg bg-good-dog-green text-white font-medium hover:bg-good-dog-dark-green">
        Next
      </button>
      <button type="button" onClick={() => reset()} className="w-28 h-10 rounded-lg text-good-dog-green font-medium hover:bg-gray-100">
        Clear Form
      </button>
      </div>
    </form>
  );
}
