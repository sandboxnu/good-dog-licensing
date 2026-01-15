"use client";

import { SubmissionStep } from "./MusicSubmissionWidget";

interface SongSubmissionHeaderProps {
  step: SubmissionStep;
}

export default function SongSubmissionHeader({
  step,
}: SongSubmissionHeaderProps) {
  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border-[.5px] border-gray-500 bg-gray-100 dark:bg-dark-gray-600 px-10 py-6 ">
      <p className="text-5xl font-medium text-green-500 dark:text-mint-200">Song submission form</p>
      {step != SubmissionStep.SUBMITTED && (
        <div className="flex flex-col gap-[12px]">
          <p className="text-lg font-medium text-dark-gray-500 dark:text-gray-200">Say “Yes” to Licensing!</p>
          <p className="text-lg font-medium text-dark-gray-500 dark:text-gray-200">
            Your music should be heard! Good Dog is all about expanding your
            creative network, expanding your audience, and getting your metadata
            into the music industry ecosystem so you can get paid. Good Dog can
            help you reach new listeners, make great new connections within the
            entertainment industry, and build a sustainable career.
          </p>
          <div className="flex flex-col gap-[4px] pl-[10px]">
            <p className="text-lg font-medium text-dark-gray-500 dark:text-gray-200">
              • You can say no to any synch placement-but you should say “Yes!”
              GDL will never license your music without your permission.
            </p>
            <p className="text-lg font-medium text-dark-gray-500 dark:text-gray-200">
              • You retain 100% of your copyrights
            </p>
            <p className="text-lg font-medium text-dark-gray-500 dark:text-gray-200">
              • You receive full attribution for all uses of your music
            </p>
            <p className="text-lg font-medium text-dark-gray-500 dark:text-gray-200">
              • You can earn public performance royalties through ASCAP or BMI
            </p>
          </div>
          <p className="font-semibold text-required-star">
            * Indicates a required question.
          </p>
        </div>
      )}
      {step == SubmissionStep.SUBMITTED && (
        <div className="flex flex-col gap-6">
          <p className="text-lg font-medium text-dark-gray-500 dark:text-gray-200">
            Your response has been recorded!
          </p>
          <a
            className="font-semibold text-secondary hover:underline text-green-500 dark:text-mint-200"
            href="/music-submission"
          >
            Submit another music submission form
          </a>
        </div>
      )}
    </div>
  );
}
