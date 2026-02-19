"use client";

import { trpc } from "@good-dog/trpc/client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import SongRequestInformation from "./components/SongRequestInformation";
import MatchingInformation from "./components/MatchingInformation";

export default function MatchingDashboard({
  songRequestId,
}: {
  songRequestId: string;
}) {
  const router = useRouter();

  const [songRequest] = trpc.getSongRequestById.useSuspenseQuery({
    songRequestId: songRequestId,
  });

  return (
    <div className="flex flex-col gap-6">
      <button
        className="flex flex-row gap-[4px] items-center max-w-[130px]"
        onClick={() =>
          router.push(
            `/home?projectId=${songRequest.projectSubmission.projectId}`,
          )
        }
      >
        <ChevronLeft className="text-green-500 dark:text-mint-200" />
        <p className="text-green-500 underline text-body2">
          {songRequest.projectSubmission.projectTitle}
        </p>
      </button>
      <div className="flex flex-row gap-10">
        <SongRequestInformation songRequest={songRequest} />
        <MatchingInformation songRequest={songRequest} />
      </div>
    </div>
  );
}
