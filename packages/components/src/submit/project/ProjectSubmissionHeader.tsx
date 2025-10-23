"use client";

import { SubmissionStep } from "./ProjectSubmissionWidget";

interface ProjectSubmissionHeaderProps {
  step: SubmissionStep;
}

export default function ProjectSubmissionHeader({
  step,
}: ProjectSubmissionHeaderProps) {
  return (
    <div className="w-full text-black border-[.5px] bg-white py-6 px-10 gap-6 flex flex-col border-black rounded-2xl">
      <p className="text-5xl font-medium">Song request form</p>
      {step != SubmissionStep.SUBMITTED && (
        <div>
          <p className="text-lg font-medium">
            Need help finding a song from our catalog? Submit a brief and one of
            our curators will get back to you with suitable music from our
            library. The more specific you are, the better we can assist!
          </p>
          <p className="text-required-star font-semibold">
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
            className="text-secondary font-semibold hover:underline"
            href="/project-submission"
          >
            Submit another song request form
          </a>
        </div>
      )}
    </div>
  );
}
