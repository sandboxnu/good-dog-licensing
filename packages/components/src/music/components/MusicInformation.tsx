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
      <div className="flex w-full flex-row justify-start gap-6 rounded-2xl border-[0.5px] border-light-gray bg-cream-100 p-6 shadow-md dark:bg-dark-gray-600">
        <div className="flex flex-grow flex-row gap-6">
          <div className="flex flex-grow flex-col justify-start gap-4">
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
          <div className="w-[1px] bg-light-gray" />
          <div className="flex flex-grow flex-col justify-start gap-4">
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
              <div className="flex flex-row items-center gap-1 font-extrabold text-secondary">
                <Link size={16} className="text-green-500 dark:text-mint-200" />
                <a
                  href={musicSubmission.songLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-500 underline underline-offset-4 dark:text-mint-200"
                >
                  View Song
                </a>
              </div>
            </div>
          </div>
        </div>
        {musicSubmission.additionalInfo.length > 0 && (
          <>
            <div className="w-[1px] bg-light-gray" />
            <div className="flex min-w-0 flex-grow flex-col gap-1">
              <p className="text-dark-gray-200 dark:text-dark-gray-100">
                Additional Information
              </p>
              <p className="break-words text-dark-gray-500 dark:text-gray-200">
                {musicSubmission.additionalInfo}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
