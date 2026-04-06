"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import MatchInformation from "./components/MatchInformation";
import MusicInformation from "./components/MusicInformation";

export default function MusicDashboard({ musicId }: { musicId: string }) {
  const router = useRouter();

  return (
    <div className="flex w-[1256px] flex-col gap-6">
      <button
        className="flex max-w-[130px] flex-row items-center gap-[4px]"
        onClick={() => router.push(`/`)}
      >
        <ChevronLeft className="text-green-500 dark:text-mint-200" />
        <p className="text-body2 text-green-500 underline dark:text-mint-200">
          Music
        </p>
      </button>
      <MusicInformation musicSubmissionId={musicId} />
      <MatchInformation musicSubmissionId={musicId} />
    </div>
  );
}
