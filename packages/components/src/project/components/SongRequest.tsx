"use client";

import type { SongRequest } from ".prisma/client";
import MusicNoteIcon from "../../svg/MusicNoteIcon";
import StatusIndicator from "../../base/StatusIndicator";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SongRequest({
  songRequest,
  status,
}: {
  songRequest: SongRequest;
  status: "TO_DO" | "IN_REVIEW" | "ACCEPTED" | "NO_MATCHES";
}) {
  const router = useRouter();

  const variant = () => {
    if (status === "TO_DO") return "error";
    if (status === "IN_REVIEW") return "blue";
    if (status === "ACCEPTED") return "success";
    else return "warning";
  };

  const text = () => {
    if (status === "TO_DO") return "Action needed";
    if (status === "IN_REVIEW") return "Pending approval";
    if (status === "ACCEPTED") return "Accepted";
    else return "Awaiting match";
  };

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    router.push(
      "/project/" +
        songRequest.projectId +
        "/song-request/" +
        songRequest.songRequestId,
    );
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
            <StatusIndicator variant={variant()} text={text()} />
          </div>
          <p>{songRequest.description}</p>
        </div>
      </div>
      <ChevronRight />
    </div>
  );
}
