import type { GetProcedureOutput } from "@good-dog/trpc/types";
import Information from "../../svg/Information";
import Camera from "../../svg/Camera";
import Check from "../../svg/Check";
import StatusIndicator from "../../base/StatusIndicator";
import Calendar from "../../svg/Calendar";
import Deadline from "../../svg/Deadline";
import GreyMusicNote from "../../svg/GreyMusicNote";
import MagnifyingGlass from "../../svg/MagnifyingGlass";
import FileIcon from "../../svg/FileIcon";
import User from "./User";

type SongRequestType = GetProcedureOutput<"getSongRequestById">;

export default function SongRequestInformation({
  songRequest,
}: {
  songRequest: SongRequestType;
}) {
  const status = {
    variant: "" as "success" | "error" | "warning" | "gray" | "blue",
    text: "",
  };

  if (
    songRequest.matches.some(
      (match) => match.matchState === "APPROVED_BY_MUSICIAN",
    )
  ) {
    status.variant = "success";
    status.text = "Complete";
  } else if (
    songRequest.matches.some(
      (match) =>
        match.matchState == "SENT_TO_MEDIA_MAKER" ||
        match.matchState == "SENT_TO_MUSICIAN",
    )
  ) {
    status.variant = "blue";
    status.text = "Awaiting Response";
  } else if (
    songRequest.matches.some(
      (match) => match.matchState === "WAITING_FOR_MANAGER_APPROVAL",
    )
  ) {
    status.variant = "warning";
    status.text = "Awaiting Manager Approval";
  } else {
    status.variant = "error";
    status.text = "Needs Attention";
  }
  return (
    <div className="flex flex-col gap-4">
      {/* Song Request Title Header */}
      <div className="flex flex-row justify-between">
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
            />
          ) : (
            <p className="text-cream-600 italic dark:text-gray-200">
              No Assignment Yet
            </p>
          )}
        </div>
      </div>

      {/* Details Pane */}
      <div className="flex flex-col py-4 gap-4 rounded-lg border-[0.5px] bg-gray-100 dark:bg-dark-gray-600 dark:border-cream-500">
        <div className="flex flex-row justify-start gap-2 mb-2 px-4 pb-2 items-center border-b-[1px] border-cream-400 dark:border-cream-500">
          <Information />
          <p className="dark:text-gray-200">Details</p>
        </div>

        <div className="flex flex-col gap-6 justify-center px-4">
          <div className="flex flex-row gap-6">
            <div className="flex flex-col gap-2 w-[188px]">
              <div className="flex flex-row gap-1 items-center">
                <Camera />
                <p className="text-sm text-cream-600 dark:text-gray-200">Media Maker</p>
              </div>
              <User
                name={
                  songRequest.projectSubmission.projectOwner.firstName +
                  " " +
                  songRequest.projectSubmission.projectOwner.lastName
                }
              />
            </div>
            <div className="flex flex-col gap-2 w-[188px]">
              <div className="flex flex-row gap-1 items-center">
                <Check />
                <p className="text-sm text-cream-600 dark:text-gray-200">Status</p>
              </div>
              <StatusIndicator variant={status.variant} text={status.text} />
            </div>
          </div>

          <div className="flex flex-row gap-6 justify-between">
            <div className="flex flex-col gap-2 w-[188px]">
              <div className="flex flex-row gap-1 items-center">
                <Deadline />
                <p className="text-sm text-cream-600 dark:text-gray-200">Deadline</p>
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
            <div className="flex flex-col gap-2 w-[188px]">
              <div className="flex flex-row gap-1 items-center">
                <Calendar />
                <p className="text-sm text-cream-600 dark:text-gray-200">Date submitted</p>
              </div>
              <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                {songRequest.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex flex-row gap-6 justify-between">
            <div className="flex flex-col gap-2 w-[188px]">
              <div className="flex flex-row gap-1 items-center">
                <GreyMusicNote />
                <p className="text-sm text-cream-600 dark:text-gray-200">Feelings conveyed</p>
              </div>
              <p className="text-sm text-dark-gray-300 dark:text-gray-200">
                {songRequest.feelingsConveyed}
              </p>
            </div>
            <div className="flex flex-col gap-2 w-[188px]">
              <div className="flex flex-row gap-1 items-center">
                <MagnifyingGlass />
                <p className="text-sm text-cream-600 dark:text-gray-200">
                  Example songs, artists, tracks
                </p>
              </div>
              <p className="text-sm text-dark-gray-300 dark:text-gray-200">
                {songRequest.similarSongs}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description Pane */}
      <div className="flex flex-col py-4 gap-4 rounded-lg border-[0.5px] bg-gray-100 dark:bg-dark-gray-600 dark:border-cream-500">
        <div className="flex flex-row justify-start gap-2 px-4 pb-2 items-center border-b-[1px] border-cream-400 dark:border-cream-500">
          <FileIcon />
          <p className="dark:text-gray-200">Description</p>
        </div>
        <p className="px-4 text-sm text-dark-gray-300 dark:text-gray-200">
          {songRequest.description}
        </p>
      </div>

      {/* Additional Information Pane */}
      <div className="flex flex-col py-4 gap-4 rounded-lg border-[0.5px] bg-gray-100 dark:bg-dark-gray-600 dark:border-cream-500">
        <div className="flex flex-row justify-start gap-2 px-4 pb-2 items-center border-b-[1px] border-cream-400 dark:border-cream-500">
          <FileIcon />
          <p className="dark:text-gray-200">Additional Information</p>
        </div>
        <p className="px-4 text-sm text-dark-gray-300 dark:text-gray-200">
          {songRequest.additionalInfo}
        </p>
      </div>
    </div>
  );
}
