"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import SongRequestComponent from "./SongRequest";
import Hourglass from "../../svg/Hourglass";
import type { GetProcedureOutput } from "@good-dog/trpc/types";
import type { MediaMakerSongRequestStatus } from "@good-dog/db";
import { getMediaMakerSongRequestStatusLabel } from "../../../utils/enumLabelMapper";

type SongRequestType =
  GetProcedureOutput<"getProjectSubmissionById">["songRequests"][number];

const descriptionMap: Record<MediaMakerSongRequestStatus, string> = {
  APPROVAL_NEEDED: "Review and approve/deny the pending matches below",
  IN_PROGRESS: "Work awaiting musician and mediator input",
  COMPLETED: "Requests in motion, stay tuned for updates",
};

export default function SongRequests({
  songRequests,
  status,
}: {
  songRequests: SongRequestType[];
  status: MediaMakerSongRequestStatus;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div
      className="bg-gray-100 dark:bg-dark-gray-600 border-[.5px] border-cream-500 rounded-2xl p-6 shadow-md flex flex-col gap-4 cursor-pointer"
      onClick={() => setDropdownOpen(!dropdownOpen)}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-xl text-dark-gray-500 dark:text-mint-300">
            {getMediaMakerSongRequestStatusLabel(status)}
          </p>
          <p className="text-dark-gray-500 dark:text-mint-300">
            {descriptionMap[status]}
          </p>
        </div>
        <ChevronDown
          className={`h-6 w-6 ${dropdownOpen ? "rotate-0" : "-rotate-90"} transition-all text-green-500 dark:text-mint-200`}
        />
      </div>
      {dropdownOpen &&
        (songRequests.length !== 0 ? (
          songRequests.map((songRequest) => (
            <SongRequestComponent
              key={songRequest.songRequestId}
              songRequest={songRequest}
            />
          ))
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Hourglass size="small" />
            <p className="text-dark-gray-500 dark:text-gray-200">
              No requests active at this time
            </p>
          </div>
        ))}
    </div>
  );
}
