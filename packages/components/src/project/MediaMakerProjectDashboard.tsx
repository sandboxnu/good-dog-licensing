"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { MediaMakerSongRequestStatus } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/client";

import MediaMakerSongRequests from "./components/MediaMakerSongRequests";
import ProjectInformation from "./components/ProjectInformation";

const mediaMakerProjectStatusOrder: MediaMakerSongRequestStatus[] = [
  MediaMakerSongRequestStatus.APPROVAL_NEEDED,
  MediaMakerSongRequestStatus.IN_PROGRESS,
  MediaMakerSongRequestStatus.COMPLETED,
];

export default function MediaMakerProjectDashboard({
  projectId,
}: {
  projectId: string;
}) {
  const [projectSubmission] = trpc.getProjectSubmissionById.useSuspenseQuery({
    projectId: projectId,
  });
  const router = useRouter();

  return (
    <div className="flex w-[992px] flex-col gap-6">
      <div className="flex flex-col gap-10">
        <div
          className="flex flex-row items-center text-secondary hover:cursor-pointer"
          onClick={() => router.push("/home")}
        >
          <ChevronLeft className="h-4 w-4 text-green-500 dark:text-mint-300" />
          <p className="font-medium text-green-500 underline dark:text-mint-200">
            Projects
          </p>
        </div>
        <ProjectInformation project={projectSubmission} />
      </div>
      {mediaMakerProjectStatusOrder.map((status) => {
        return (
          <MediaMakerSongRequests
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
