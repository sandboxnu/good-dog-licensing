"use client";

import type { SongRequest } from ".prisma/client";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { GetProcedureOutput } from "@good-dog/trpc/types";
import type { StatusIndicatorType } from "../../../base/StatusIndicator";
import StatusIndicator from "../../../base/StatusIndicator";

type SongRequestWithMatchesType =
  GetProcedureOutput<"allProjects">["projects"][number]["songRequests"][number];

export default function SongRequest({
  songRequest,
}: {
  songRequest: SongRequestWithMatchesType;
}) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/song-request/" + songRequest.songRequestId);
  };

  const status = (): StatusIndicatorType => {
    if (
      songRequest.matches.some(
        (match) => match.matchState === "WAITING_FOR_MANAGER_APPROVAL",
      )
    ) {
      return { variant: "error", text: "Action needed" };
    }

    if (
      songRequest.matches.some(
        (match) =>
          match.matchState === "SENT_TO_MUSICIAN" ||
          match.matchState === "SENT_TO_MEDIA_MAKER",
      )
    ) {
      return { variant: "blue", text: "Pending approval" };
    }

    if (
      songRequest.matches.some(
        (match) => match.matchState === "APPROVED_BY_MUSICIAN",
      )
    ) {
      return { variant: "success", text: "Accepted" };
    }

    return { variant: "gray", text: "Rejected" };
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
