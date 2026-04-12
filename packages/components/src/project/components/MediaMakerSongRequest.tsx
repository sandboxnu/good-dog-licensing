"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";

import StatusIndicator from "../../base/StatusIndicator";
import MusicNoteIcon from "../../svg/MusicNoteIcon";

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
      className="flex flex-row items-center justify-between rounded-2xl border-[1px] border-cream-500 bg-cream-100 p-6 hover:cursor-pointer dark:bg-green-500"
      onClick={handleClick}
    >
      <div className="flex flex-row items-center gap-4">
        <MusicNoteIcon />
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-4">
            <p className="text-xl font-semibold text-dark-gray-500 dark:text-mint-300">
              {songRequest.songRequestTitle}
            </p>
            <StatusIndicator status={songRequest.mediaMakerStatus} />
          </div>
          <p className="text-dark-gray-500 dark:text-gray-200">
            {songRequest.description}
          </p>
        </div>
      </div>
      <ChevronRight className="text-green-500 dark:text-mint-200" />
    </div>
  );
}
