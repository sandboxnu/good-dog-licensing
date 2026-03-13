"use client";

import type { SongRequest } from ".prisma/client";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { GetProcedureOutput } from "@good-dog/trpc/types";
import type { StatusIndicatorType } from "../../../base/StatusIndicator";
import StatusIndicator from "../../../base/StatusIndicator";
import { getStatusLabel } from "../../../../utils/enumLabelMapper";

type SongRequestType =
  GetProcedureOutput<"getProjectSubmissionById">["songRequests"][number];

export default function SongRequest({
  songRequest,
}: {
  songRequest: SongRequestType;
}) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/song-request/" + songRequest.songRequestId);
  };

  const status = (): StatusIndicatorType => {
    if (
      songRequest.adminStatus === "APPROVAL_NEEDED" ||
      songRequest.adminStatus === "SUGGESTIONS_NEEDED"
    ) {
      return {
        variant: "error",
        text: getStatusLabel(songRequest.adminStatus),
      };
    }

    if (songRequest.adminStatus === "IN_PROGRESS") {
      return { variant: "blue", text: getStatusLabel(songRequest.adminStatus) };
    }

    return {
      variant: "success",
      text: getStatusLabel(songRequest.adminStatus),
    };
  };

  return (
    <div
      className="border-[0.5px] bg-cream-100 dark:bg-green-500 border-cream-500 rounded-2xl p-4 flex flex-row justify-between hover:cursor-pointer items-center"
      onClick={handleClick}
    >
      <div className="flex flex-row gap-4 items-center">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-4">
            <p className="text-xl font-semibold text-dark-gray-500 dark:text-mint-300">
              {songRequest.songRequestTitle}
            </p>
            <StatusIndicator {...status()} />
          </div>
          <p className="text-dark-gray-300 dark:text-gray-200">
            {songRequest.description}
          </p>
        </div>
      </div>
      <ChevronRight className="text-green-500 dark:text-mint-200" />
    </div>
  );
}
