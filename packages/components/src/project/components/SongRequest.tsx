"use client";

import type { SongRequest } from ".prisma/client";
import MusicNoteIcon from "../../svg/MusicNoteIcon";
import StatusIndicator from "../../base/StatusIndicator";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { getSongRequestStatus } from "../../../utils/getStatusHelper";

type SongRequestWithMatchesType =
  GetProcedureOutput<"getProjectSubmissionById">["songRequests"][number];

export default function SongRequest({
  songRequest,
}: {
  songRequest: SongRequestWithMatchesType;
}) {
  const router = useRouter();

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    router.push("/song-request/" + songRequest.songRequestId);
    e.stopPropagation();
  };

  return (
    <div
      className="border-[1px] bg-cream-100 border-cream-500 rounded-2xl p-6 flex flex-row justify-between hover:cursor-pointer items-center"
      onClick={handleClick}
    >
      <div className="flex flex-row gap-4 items-center">
        <MusicNoteIcon />
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-4">
            <p className="text-xl font-semibold">
              {songRequest.songRequestTitle}
            </p>
            <StatusIndicator {...getSongRequestStatus(songRequest)} />
          </div>
          <p>{songRequest.description}</p>
        </div>
      </div>
      <ChevronRight />
    </div>
  );
}
