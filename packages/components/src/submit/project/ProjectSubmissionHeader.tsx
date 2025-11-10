"use client";

import { SubmissionStep } from "./ProjectSubmissionWidget";

interface ProjectSubmissionHeaderProps {
  step: SubmissionStep;
}

export default function ProjectSubmissionHeader({
  step,
}: ProjectSubmissionHeaderProps) {
  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border-[.5px] border-black bg-white px-10 py-6 text-black">
      <p className="text-5xl font-medium">Song request form</p>
      {step != SubmissionStep.SUBMITTED && (
        <div>
          <p className="text-lg font-medium">
            Need help finding a song from our catalog? Submit a brief and one of
            our curators will get back to you with suitable music from our
            library. The more specific you are, the better we can assist!
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
            Submit another song request form
          </a>
        </div>
      )}
    </div>
  );
}
