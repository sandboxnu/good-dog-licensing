import type { GetProcedureOutput } from "@good-dog/trpc/types";
import StatusIndicator from "../../base/StatusIndicator";

type SongRequestType = GetProcedureOutput<"getSongRequestById">;

export default function MediaMakerSongRequestInformation({
  songRequest,
}: {
  songRequest: SongRequestType;
}) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="text-4xl text-dark-gray-500 dark:text-mint-300">
        Song Request Information
      </p>
      <div className="grid grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] bg-cream-100 dark:bg-green-600 rounded-2xl p-6 border-[0.5px] border-light-gray shadow-md w-full">
        <div className="flex flex-col gap-4 justify-start min-w-0 pr-6">
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
        <div className="flex flex-col gap-4 justify-start min-w-0 pl-6 border-l border-light-gray">
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
              <p className="text-dark-gray-500 dark:text-gray-200 break-words">
                {songRequest.additionalInfo}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
