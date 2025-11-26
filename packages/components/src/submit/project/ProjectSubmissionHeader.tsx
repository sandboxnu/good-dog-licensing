"use client";

import { SubmissionStep } from "./ProjectSubmissionWidget";

interface ProjectSubmissionHeaderProps {
  step: SubmissionStep;
}

export default function ProjectSubmissionHeader({
  step,
}: ProjectSubmissionHeaderProps) {
  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border-[.5px] border-gray-500 bg-gray-100 dark:bg-dark-gray-600 p-10 text-black">
      <p className="text-5xl font-medium text-green-500 dark:text-mint-200">Project submission form</p>
      {step != SubmissionStep.SUBMITTED && (
        <div className="flex flex-col gap-[10px]">
          <p className="text-lg font-medium text-dark-gray-500 dark:text-gray-200">
            Getting the rights to music can be an extremely expensive and
            cumbersome process. Even finding the right music can be a struggle.
            Good Dog takes care of everything and at no cost to you. Tell us
            what you need, we will source the music for you, and utilize our
            original licensing agreement. The entire process is seamless and
            perfectly tailored to each party.
          </p>
          <p className="font-semibold text-required-star">
            * Indicates a required question.
          </p>
        </div>
      )}
      {step == SubmissionStep.SUBMITTED && (
        <div className="flex flex-col gap-6">
          <p className="text-lg font-medium">
            Your response has been recorded!
          </p>
          <a
            className="font-semibold text-secondary hover:underline"
            href="/project-submission"
          >
            Submit another project submission form
          </a>
        </div>
      )}
    </div>
  );
}
