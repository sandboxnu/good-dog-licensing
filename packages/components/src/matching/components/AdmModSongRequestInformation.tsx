import type { GetProcedureOutput } from "@good-dog/trpc/types";

import StatusIndicator from "../../base/StatusIndicator";
import User from "./User";
import { Calendar, CalendarCheck, Camera, CircleCheck, File, Info, Music, Search } from "lucide-react";

type SongRequestType = GetProcedureOutput<"getSongRequestById">;

export default function AdmModSongRequestInformation({
  songRequest,
}: {
  songRequest: SongRequestType;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Song Request Title Header */}
      <div className="flex flex-col justify-between gap-[10px] lg:flex-row">
        <p className="text-xl dark:text-gray-200">
          {songRequest.songRequestTitle}
        </p>
        <div className="flex flex-row items-center gap-1">
          <p className="text-xs text-cream-600 dark:text-gray-200">
            Assigned to{" "}
          </p>
          {songRequest.projectSubmission.projectManager ? (
            <User
              name={
                songRequest.projectSubmission.projectManager.firstName +
                " " +
                songRequest.projectSubmission.projectManager.lastName
              }
              id={songRequest.projectSubmission.projectManager.userId}
              role={"MODERATOR"}
            />
          ) : (
            <p className="italic text-cream-600 dark:text-gray-200">
              No Assignment Yet
            </p>
          )}
        </div>
      </div>

      {/* Details Pane */}
      <div className="flex flex-col gap-4 rounded-lg border-[0.5px] bg-gray-100 py-4 dark:border-cream-500 dark:bg-dark-gray-600">
        <div className="mb-2 flex flex-row items-center justify-start gap-2 border-b-[1px] border-cream-400 px-4 pb-2 dark:border-cream-500">
          <Info className="w-4 h-4 text-gray-400" />
          <p className="dark:text-gray-200">Details</p>
        </div>

        <div className="grid grid-cols-1 gap-6 px-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-1">
              <Camera className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-cream-600 dark:text-gray-200">
                Media Maker
              </p>
            </div>
            <User
              name={
                songRequest.projectSubmission.projectOwner.firstName +
                " " +
                songRequest.projectSubmission.projectOwner.lastName
              }
              id={songRequest.projectSubmission.projectOwner.userId}
              role={"MEDIA_MAKER"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-1">
              <CircleCheck className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-cream-600 dark:text-gray-200">
                Status
              </p>
            </div>
            <StatusIndicator status={songRequest.admModStatus} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-1">
              <CalendarCheck className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-cream-600 dark:text-gray-200">
                Deadline
              </p>
            </div>
            <p className="text-sm text-dark-gray-400 dark:text-gray-200">
              {songRequest.projectSubmission.deadline.toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-cream-600 dark:text-gray-200">
                Date submitted
              </p>
            </div>
            <p className="text-sm text-dark-gray-400 dark:text-gray-200">
              {songRequest.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-1">
              <Music className="text-gray-400 h-4 w-4" />
              <p className="text-sm text-cream-600 dark:text-gray-200">
                Feelings conveyed
              </p>
            </div>
            <p className="text-sm text-dark-gray-300 dark:text-gray-200">
              {songRequest.feelingsConveyed}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-1">
              <Search className="text-gray-400 h-4 w-4" />
              <p className="text-sm text-cream-600 dark:text-gray-200">
                Example songs, artists, etc
              </p>
            </div>
            <p className="text-sm text-dark-gray-300 dark:text-gray-200">
              {songRequest.similarSongs}
            </p>
          </div>
        </div>
      </div>

      {/* Description Pane */}
      <div className="flex flex-col gap-4 rounded-lg border-[0.5px] bg-gray-100 py-4 dark:border-cream-500 dark:bg-dark-gray-600">
        <div className="flex flex-row items-center justify-start gap-2 border-b-[1px] border-cream-400 px-4 pb-2 dark:border-cream-500">
          <File className="w-4 h-4 text-gray-400" />
          <p className="dark:text-gray-200">Description</p>
        </div>
        <p className="px-4 text-sm text-dark-gray-300 dark:text-gray-200">
          {songRequest.description}
        </p>
      </div>

      {/* Additional Information Pane */}
      {songRequest.additionalInfo.length > 0 && (
        <div className="flex flex-col gap-4 rounded-lg border-[0.5px] bg-gray-100 py-4 dark:border-cream-500 dark:bg-dark-gray-600">
          <div className="flex flex-row items-center justify-start gap-2 border-b-[1px] border-cream-400 px-4 pb-2 dark:border-cream-500">
            <File className="w-4 h-4 text-gray-400" />
            <p className="dark:text-gray-200">Additional Information</p>
          </div>
          <p className="px-4 text-sm text-dark-gray-300 dark:text-gray-200">
            {songRequest.additionalInfo}
          </p>
        </div>
      )}
    </div>
  );
}
