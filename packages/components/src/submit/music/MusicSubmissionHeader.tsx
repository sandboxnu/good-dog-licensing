"use client";

import { SubmissionStep } from "./MusicSubmissionWidget";

interface ProjectSubmissionHeaderProps {
  step: SubmissionStep;
}

export default function ProjectSubmissionHeader({
  step,
}: ProjectSubmissionHeaderProps) {
  return (
    <div className="w-full text-black border-[.5px] bg-white py-6 px-10 gap-6 flex flex-col border-black rounded-2xl">
      <p className="text-5xl font-medium">Music submission form</p>
      {step != SubmissionStep.SUBMITTED && (
        <div>
          <p className="text-lg font-medium">
            We are so thrilled that you're interested! Good Dog Licensing is
            Northeastern's student-run music-licensing platform for independent
            musicians. We aspire to connect independent artists and independent
            content creators. 100% of any money earned from a synch deal will go
            to you! Good Dog will be no-risk and non-exclusive. You will keep
            all your rights, you can say “no” to any placements and you will be
            able to withdraw your music at any time!!
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
            href="/music-submission"
          >
            Submit another music submission form
          </a>
        </div>
      )}
    </div>
  );
}
