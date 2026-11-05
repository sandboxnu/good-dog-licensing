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
      <p className="text-2xl text-dark-gray-500 md:text-4xl dark:text-mint-300">
        Song Request Information
      </p>
      <div className="grid w-full grid-cols-1 rounded-2xl border-[0.5px] border-light-gray bg-cream-100 p-6 shadow-md md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] dark:bg-green-600">
        <div className="flex min-w-0 flex-col justify-start gap-4 pb-4 md:pr-6 md:pb-0">
          <div className="flex flex-col gap-1">
            <p className="text-dark-gray-200 dark:text-dark-gray-100">
              Song Request
            </p>
            <p className="text-dark-gray-500 dark:text-gray-200">
              {songRequest.songRequestTitle}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-dark-gray-200 dark:text-dark-gray-100">Status</p>
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
        <div className="flex min-w-0 flex-col justify-start gap-4 border-t border-light-gray pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
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
          {songRequest.additionalInfo.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-dark-gray-200 dark:text-dark-gray-100">
                Additional Information
              </p>
              <p className="wrap-break-word text-dark-gray-500 dark:text-gray-200">
                {songRequest.additionalInfo}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
