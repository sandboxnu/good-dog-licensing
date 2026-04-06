import type { GetProcedureOutput } from "@good-dog/trpc/types";

import StatusIndicator from "../../base/StatusIndicator";

type SongRequestType = GetProcedureOutput<"getSongRequestById">;

export default function MediaMakerSongRequestInformation({
  songRequest,
}: {
  songRequest: SongRequestType;
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-4xl text-dark-gray-500 dark:text-mint-300">
        Song Request Information
      </p>
      <div className="flex w-full flex-row justify-start gap-6 rounded-2xl border-[0.5px] border-light-gray bg-cream-100 p-6 shadow-md dark:bg-green-600">
        <div className="flex flex-grow flex-row gap-6">
          <div className="flex flex-grow flex-col justify-start gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-dark-gray-200 dark:text-dark-gray-100">
                Song Request
              </p>
              <p className="text-dark-gray-500 dark:text-gray-200">
                {songRequest.songRequestTitle}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-dark-gray-200 dark:text-dark-gray-100">
                Status
              </p>
              <StatusIndicator status={songRequest.mediaMakerStatus} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-dark-gray-200 dark:text-dark-gray-100">
                Request Added
              </p>
              <p className="text-dark-gray-500 dark:text-gray-200">
                {songRequest.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="w-[1px] bg-light-gray" />
        <div className="flex flex-grow flex-col justify-start gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-dark-gray-200 dark:text-dark-gray-100">
              Summary
            </p>
            <p className="text-dark-gray-500 dark:text-gray-200">
              {songRequest.description}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-dark-gray-200 dark:text-dark-gray-100">
              Song purpose
            </p>
            <p className="text-dark-gray-500 dark:text-gray-200">
              {songRequest.feelingsConveyed}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-dark-gray-200 dark:text-dark-gray-100">
              Similar songs
            </p>
            <p className="text-dark-gray-500 dark:text-gray-200">
              {songRequest.similarSongs}
            </p>
          </div>
        </div>
        {songRequest.additionalInfo.length > 0 && (
          <>
            <div className="w-[1px] bg-light-gray" />
            <div className="flex flex-grow flex-col gap-1">
              <p className="text-dark-gray-200 dark:text-dark-gray-100">
                Additional Information
              </p>
              <p className="text-dark-gray-500 dark:text-gray-200">
                {songRequest.additionalInfo}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
