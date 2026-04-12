"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";

import type { SongRequest } from ".prisma/client";
import StatusIndicator from "../../../base/StatusIndicator";

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

  return (
    <div
      className="flex flex-row items-center justify-between rounded-2xl border-[0.5px] border-cream-500 bg-cream-100 p-4 hover:cursor-pointer dark:bg-green-500"
      onClick={handleClick}
    >
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-4">
            <p className="text-xl font-semibold text-dark-gray-500 dark:text-mint-300">
              {songRequest.songRequestTitle}
            </p>
            <StatusIndicator status={songRequest.admModStatus} />
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
