"use client";

import MusicInformation from "./components/MusicInformation";
import MatchInformation from "./components/MatchInformation";

export default function MusicDashboard({ musicId }: { musicId: string }) {
  return (
    <div className="w-[1256px] flex flex-col gap-6">
      <MusicInformation musicSubmissionId={musicId} />
      <MatchInformation musicSubmissionId={musicId} />
    </div>
  );
}
