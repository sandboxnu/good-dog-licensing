"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Music } from "lucide-react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";

import StatusIndicator from "../../base/StatusIndicator";

type SongRequestType =
  GetProcedureOutput<"getProjectSubmissionById">["songRequests"][number];

export default function MediaMakerSongRequest({
  songRequest,
}: {
  songRequest: SongRequestType;
}) {
  const router = useRouter();

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    router.push("/song-request/" + songRequest.songRequestId);
    e.stopPropagation();
  };

  return (
    <div
      className="flex flex-row items-center justify-between gap-2 rounded-2xl border border-cream-500 bg-cream-100 p-4 hover:cursor-pointer md:p-6 dark:bg-green-500"
      onClick={handleClick}
    >
      <div className="flex min-w-0 flex-row items-center gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-400 text-mint-100 dark:bg-green-300 dark:text-mint-300">
          <Music className="h-5 w-5" />
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-xl font-semibold text-dark-gray-500 dark:text-mint-300">
              {songRequest.songRequestTitle}
            </p>
            <StatusIndicator status={songRequest.mediaMakerStatus} />
          </div>
          <p className="wrap-break-word text-dark-gray-500 dark:text-gray-200">
            {songRequest.description}
          </p>
        </div>
      </div>
      <ChevronRight className="shrink-0 text-green-500 dark:text-mint-200" />
    </div>
  );
}
