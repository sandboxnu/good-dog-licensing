"use client";

import type { SongRequest } from ".prisma/client";
import MusicNoteIcon from "../../svg/MusicNoteIcon";
import StatusIndicator from "../../base/StatusIndicator";
import { ChevronRight } from "lucide-react";

export default function SongRequest({
  songRequest,
}: {
  songRequest: SongRequest;
}) {
  return (
    <div
      className="border-[1px] border-cream-500 rounded-2xl p-6 flex flex-row justify-between hover:cursor-pointer items-center"
      onClick={() => window.location.replace("TODO:")}
    >
      <div className="flex flex-row gap-4 items-center">
        <MusicNoteIcon />
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-4">
            <p className="text-xl font-semibold">
              {songRequest.songRequestTitle}
            </p>
            <StatusIndicator variant={"success"} text={"Approved"} />
          </div>
          <p>{songRequest.description}</p>
        </div>
      </div>
      <ChevronRight />
    </div>
  );
}
