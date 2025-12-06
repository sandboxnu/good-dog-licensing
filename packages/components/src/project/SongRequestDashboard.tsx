"use client";

import { trpc } from "@good-dog/trpc/client";
import { ChevronLeft } from "lucide-react";
import ProjectInformation from "./components/ProjectInformation";
import SongRequests from "./components/SongRequests";

export default function SongRequestDashboard({
  projectId,
}: {
  projectId: string;
}) {
  const [projectSubmission] = trpc.getProjectSubmissionById.useSuspenseQuery({
    projectId: projectId,
  });

  return (
    <div className="w-[992px] flex flex-col gap-6">
      <div className="flex flex-col gap-10">
        <div
          className="flex flex-row items-center text-secondary hover:cursor-pointer"
          onClick={() => window.location.replace("/")}
        >
          <ChevronLeft className="h-4 w-4" />
          <p className="underline font-medium">Projects</p>
        </div>
        <ProjectInformation project={projectSubmission} />
      </div>
      <SongRequests songRequests={projectSubmission.songRequests} status="TO_DO" />
      <SongRequests songRequests={projectSubmission.songRequests} status="IN_REVIEW" />
      <SongRequests songRequests={projectSubmission.songRequests} status="ACCEPTED" />
    </div>
  );
}
