"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { MediaMakerSongRequestStatus } from "@good-dog/db";
import type { GetProcedureOutput } from "@good-dog/trpc/types";

import { getStatusLabel } from "../../../utils/enumLabelMapper";
import Hourglass from "../../svg/Hourglass";
import SongRequestComponent from "./MediaMakerSongRequest";

type SongRequestType =
  GetProcedureOutput<"getProjectSubmissionById">["songRequests"][number];

const descriptionMap: Record<MediaMakerSongRequestStatus, string> = {
  APPROVAL_NEEDED: "Review and approve/deny the pending matches below",
  IN_PROGRESS: "Work awaiting musician and mediator input",
  COMPLETED: "Requests with complete matches",
};

export default function MediaMakerSongRequests({
  songRequests,
  status,
}: {
  songRequests: SongRequestType[];
  status: MediaMakerSongRequestStatus;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(songRequests.length > 0);

  return (
    <div
      className="flex cursor-pointer flex-col gap-4 rounded-2xl border-[.5px] border-cream-500 bg-gray-100 p-6 shadow-md dark:bg-dark-gray-600"
      onClick={() => setDropdownOpen(!dropdownOpen)}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold text-dark-gray-500 dark:text-mint-300">
            {getStatusLabel(status)}
          </p>
          <p className="text-dark-gray-500 dark:text-mint-300">
            {descriptionMap[status]}
          </p>
        </div>
        <ChevronDown
          className={`h-6 w-6 ${dropdownOpen ? "rotate-0" : "-rotate-90"} text-green-500 transition-all dark:text-mint-200`}
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
