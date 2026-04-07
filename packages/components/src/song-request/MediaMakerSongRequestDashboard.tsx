"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { trpc } from "@good-dog/trpc/client";

import MatchInformation from "./components/MatchInformation";
import MediaMakerSongRequestInformation from "./components/MediaMakerSongRequestInformation";

export default function MediaMakerSongRequestDashboard({
  songRequestId,
}: {
  songRequestId: string;
}) {
  const router = useRouter();

  const [songRequest] = trpc.getSongRequestById.useSuspenseQuery({
    songRequestId: songRequestId,
  });

  return (
    <div className="flex max-w-full flex-col gap-6">
      <button
        className="flex max-w-[130px] flex-row items-center gap-[4px]"
        onClick={() => router.push(`/project/${songRequest.projectId}`)}
      >
        <ChevronLeft className="text-green-500 dark:text-mint-200" />
        <p className="text-body2 text-green-500 underline dark:text-mint-200">
          Song requests
        </p>
      </button>
      <MediaMakerSongRequestInformation songRequest={songRequest} />
      <MatchInformation matches={songRequest.matches} />
    </div>
  );
}
