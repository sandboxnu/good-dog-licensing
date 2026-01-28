import type { GetProcedureOutput } from "@good-dog/trpc/types";
import StatusIndicator from "../../base/StatusIndicator";
import { getSongRequestStatus } from "../../../utils/getStatusHelper";

type SongRequestType = GetProcedureOutput<"getSongRequestById">;

export default function SongRequestInformation({
  songRequest,
}: {
  songRequest: SongRequestType;
}) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="text-4xl text-dark-gray-300 dark:text-mint-300">
        Song Request Information
      </p>
      <div className="flex flex-row gap-6 bg-cream-100 dark:bg-green-500 justify-start rounded-2xl p-6 border-[0.5px] border-light-gray shadow-md w-full">
        <div className="flex flex-row flex-grow gap-6">
          <div className="flex flex-col gap-4 justify-start flex-grow">
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
              <StatusIndicator {...getSongRequestStatus(songRequest)} />
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
        <div className="flex flex-col gap-4 justify-start flex-grow">
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
            <div className="flex flex-col gap-1 flex-grow">
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
