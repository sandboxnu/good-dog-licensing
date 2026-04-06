"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { trpc } from "@good-dog/trpc/client";

import AdmModSongRequestInformation from "./components/AdmModSongRequestInformation";
import MatchingInformation from "./components/MatchingInformation";

export default function AdmModMatchingDashboard({
  songRequestId,
}: {
  songRequestId: string;
}) {
  const router = useRouter();

  const [songRequest] = trpc.getSongRequestById.useSuspenseQuery({
    songRequestId: songRequestId,
  });

  return (
    <div className="flex flex-col gap-6 max-w-full">
      <button
        className="flex flex-row gap-[4px] items-center"
        onClick={() =>
          router.push(
            `/home?projectId=${songRequest.projectSubmission.projectId}`,
          )
        }
      >
        <ChevronLeft className="text-green-500 dark:text-mint-200" />
        <p className="text-body2 text-green-500 underline dark:text-gray-200">
          {songRequest.projectSubmission.projectTitle}
        </p>
      </button>
      <div className="flex flex-row gap-10">
        <div className="w-2/5 shrink-0">
          <AdmModSongRequestInformation songRequest={songRequest} />
        </div>
        <div className="w-3/5 min-w-0">
          <MatchingInformation songRequest={songRequest} />
        </div>
      </div>
    </div>
  );
}
