"use client";

import type { MusicSubmissionMode } from "./MusicSubmissionWidget";
import { SubmissionStep } from "./MusicSubmissionWidget";

interface SongSubmissionHeaderProps {
  step: SubmissionStep;
  mode: MusicSubmissionMode;
}

export default function SongSubmissionHeader({
  step,
  mode,
}: SongSubmissionHeaderProps) {
  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border-[.5px] border-gray-500 bg-gray-100 px-6 py-6 md:px-10 dark:bg-dark-gray-600">
      <p className="text-3xl font-medium text-green-500 md:text-5xl dark:text-mint-200">
        {mode.type === "review" ? "Review your song" : "Song submission form"}
      </p>
      {mode.type === "admin" && step != SubmissionStep.SUBMITTED && (
        <p className="rounded-lg bg-mint-300 px-4 py-3 text-base font-medium text-dark-gray-500 md:text-lg dark:bg-green-400 dark:text-mint-200">
          You are submitting this song on behalf of{" "}
          <strong>
            {mode.musician.firstName} {mode.musician.lastName}
          </strong>
          . Fill out the form as they would. They will be asked to review and
          approve it before it can be matched.
        </p>
      )}
      {mode.type === "review" && step != SubmissionStep.SUBMITTED && (
        <p className="rounded-lg bg-mint-300 px-4 py-3 text-base font-medium text-dark-gray-500 md:text-lg dark:bg-green-400 dark:text-mint-200">
          The Good Dog team added this song to Good Dog on your behalf. Review
          the information below, make any edits needed, and approve it so it can
          be pitched to briefs. If you don&apos;t want this song on Good Dog,
          you can decline it on the last step.
        </p>
      )}
      {step != SubmissionStep.SUBMITTED && (
        <div className="flex flex-col gap-[12px]">
          <p className="text-base font-medium text-dark-gray-500 md:text-lg dark:text-gray-200">
            Say “Yes” to Licensing!
          </p>
          <p className="text-base font-medium text-dark-gray-500 md:text-lg dark:text-gray-200">
            Your music should be heard! Good Dog is all about expanding your
            creative network, expanding your audience, and getting your metadata
            into the music industry ecosystem so you can get paid. Good Dog can
            help you reach new listeners, make great new connections within the
            entertainment industry, and build a sustainable career.
          </p>
          <div className="flex flex-col gap-[4px] pl-[10px]">
            <p className="text-base font-medium text-dark-gray-500 md:text-lg dark:text-gray-200">
              • You can say no to any synch placement-but you should say “Yes!”
              GDL will never license your music without your permission.
            </p>
            <p className="text-base font-medium text-dark-gray-500 md:text-lg dark:text-gray-200">
              • You retain 100% of your copyrights
            </p>
            <p className="text-base font-medium text-dark-gray-500 md:text-lg dark:text-gray-200">
              • You receive full attribution for all uses of your music
            </p>
            <p className="text-base font-medium text-dark-gray-500 md:text-lg dark:text-gray-200">
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
          <p className="text-base font-medium text-dark-gray-500 md:text-lg dark:text-gray-200">
            {mode.type === "admin"
              ? `The song has been sent to ${mode.musician.firstName} ${mode.musician.lastName} for review.`
              : mode.type === "review"
                ? "Thank you! Your song has been approved and submitted."
                : "Your response has been recorded!"}
          </p>
          <a
            className="font-semibold text-green-500 text-secondary hover:underline dark:text-mint-200"
            href={
              mode.type === "musician"
                ? "/music-submission"
                : mode.type === "admin"
                  ? "/home/songs"
                  : "/home"
            }
          >
            {mode.type === "admin"
              ? "Back to songs"
              : mode.type === "review"
                ? "Back to my songs"
                : "Submit another music submission form"}
          </a>
        </div>
      )}
    </div>
  );
}
