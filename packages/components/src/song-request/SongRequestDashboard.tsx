"use client";

import { trpc } from "@good-dog/trpc/client";
import SongRequestInformation from "./components/SongRequestInformation";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import MatchInformation from "./components/MatchInformation";

export default function SongRequestDashboard({
  songRequestId,
}: {
  songRequestId: string;
}) {
  const router = useRouter();

  const [songRequest] = trpc.getSongRequestById.useSuspenseQuery({
    songRequestId: songRequestId,
  });

  return (
    <div className="w-[1256px] flex flex-col gap-6">
      <button
        className="flex flex-row gap-[4px] items-center max-w-[130px]"
        onClick={() => router.push(`/project/${songRequest.projectId}`)}
      >
        <ChevronLeft />
        <p className="text-green-500 underline text-body2">Song requests</p>
      </button>
      <div className="pt-[40px]">
        <h3>{songRequest.songRequestTitle}</h3>
      </div>
      <SongRequestInformation songRequest={songRequest} />
      <MatchInformation matches={songRequest.matches} />
    </div>
  );
}
