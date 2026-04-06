import { Link } from "lucide-react";

import { trpc } from "@good-dog/trpc/client";

import { formatAllCapsList } from "../../../utils/allCapsListFormatter";

export default function MusicInformation({
  musicSubmissionId,
}: {
  musicSubmissionId: string;
}) {
  const [musicSubmission] = trpc.getMusicSubmissionById.useSuspenseQuery({
    musicId: musicSubmissionId,
  });

  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-4xl text-dark-gray-500 dark:text-mint-300">
        Music Information
      </p>
      <div className="grid grid-cols-2 bg-cream-100 dark:bg-dark-gray-600 rounded-2xl p-6 border-[0.5px] border-light-gray shadow-md w-full">
        <div className="flex flex-col gap-4 justify-start min-w-0 pr-6">
          <div className="flex flex-col gap-1">
            <p className="text-dark-gray-200 dark:text-dark-gray-100">Song</p>
            <p className="text-dark-gray-500 dark:text-gray-200">
              {musicSubmission.songName}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-dark-gray-200 dark:text-dark-gray-100">
              Artist/Band
            </p>
            <p className="text-dark-gray-500 dark:text-gray-200">
              {musicSubmission.performerName}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-dark-gray-200 dark:text-dark-gray-100">
              Genre(s)
            </p>
            <p className="text-dark-gray-500 dark:text-gray-200">
              {formatAllCapsList(musicSubmission.genres)}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 justify-start min-w-0 px-6 border-l border-light-gray">
          <div className="flex flex-col gap-1">
            <p className="text-dark-gray-200 dark:text-dark-gray-100">
              Date Submitted
            </p>
            <p className="text-dark-gray-500 dark:text-gray-200">
              {musicSubmission.createdAt.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-dark-gray-200 dark:text-dark-gray-100">Link</p>
            <div className="flex flex-row gap-1 text-secondary font-extrabold items-center">
              <Link size={16} className="text-green-500 dark:text-mint-200" />
              <a
                href={musicSubmission.songLink}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 text-green-500 dark:text-mint-200"
              >
                View Song
              </a>
            </div>
          </div>
          {musicSubmission.additionalInfo.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-dark-gray-200 dark:text-dark-gray-100">
                Additional Information
              </p>
              <p className="break-words text-dark-gray-500 dark:text-gray-200">
                {musicSubmission.additionalInfo}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
