"use client";

import { trpc } from "@good-dog/trpc/client";
import { ChevronLeft } from "lucide-react";
import ProjectInformation from "./components/ProjectInformation";
import SongRequests from "./components/SongRequests";
import { useRouter } from "next/navigation";
import { MediaMakerSongRequestStatus } from "@good-dog/db";

export default function ProjectDashboard({ projectId }: { projectId: string }) {
  const [projectSubmission] = trpc.getProjectSubmissionById.useSuspenseQuery({
    projectId: projectId,
  });
  const router = useRouter();

  return (
    <div className="w-[992px] flex flex-col gap-6">
      <div className="flex flex-col gap-10">
        <div
          className="flex flex-row items-center text-secondary hover:cursor-pointer"
          onClick={() => router.push("/home")}
        >
          <ChevronLeft className="h-4 w-4 text-green-500 dark:text-mint-300" />
          <p className="underline font-medium text-green-500 dark:text-mint-200">
            Projects
          </p>
        </div>
        <ProjectInformation project={projectSubmission} />
      </div>
      {Object.values(MediaMakerSongRequestStatus).map((status) => {
        return (
          <SongRequests
            key={status}
            songRequests={projectSubmission.songRequests.filter(
              (songRequest) => songRequest.mediaMakerStatus === status,
            )}
            status={status}
          />
        );
      })}
    </div>
  );
}
