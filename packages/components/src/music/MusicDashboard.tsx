"use client";

import MusicInformation from "./components/MusicInformation";
import MatchInformation from "./components/MatchInformation";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function MusicDashboard({ musicId }: { musicId: string }) {
  const router = useRouter();

  return (
    <div className="w-[1256px] flex flex-col gap-6">
      <button
        className="flex flex-row gap-[4px] items-center max-w-[130px]"
        onClick={() => router.push(`/`)}
      >
        <ChevronLeft className="text-green-500 dark:text-mint-200" />
        <p className="text-green-500 dark:text-mint-200 underline text-body2">
          Music
        </p>
      </button>
      <MusicInformation musicSubmissionId={musicId} />
      <MatchInformation musicSubmissionId={musicId} />
    </div>
  );
}
