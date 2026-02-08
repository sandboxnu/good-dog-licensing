"use client";

import { trpc } from "@good-dog/trpc/client";
import { ChevronLeft } from "lucide-react";
import ProjectInformation from "./components/ProjectInformation";
import SongRequests from "./components/SongRequests";
import { useRouter } from "next/navigation";

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
          onClick={() => router.push("/")}
        >
          <ChevronLeft className="h-4 w-4 text-green-500 dark:text-mint-300" />
          <p className="underline font-medium text-green-500 dark:text-mint-200">
            Projects
          </p>
        </div>
        <ProjectInformation project={projectSubmission} />
      </div>
      <SongRequests
        songRequests={projectSubmission.songRequests.filter((songRequest) => {
          return songRequest.matches.some(
            (match) => match.matchState === "SENT_TO_MEDIA_MAKER",
          );
        })}
        status="TO_DO"
      />
      <SongRequests
        songRequests={projectSubmission.songRequests.filter((songRequest) => {
          return songRequest.matches.some(
            (match) => match.matchState === "SENT_TO_MUSICIAN",
          );
        })}
        status="IN_REVIEW"
      />
      <SongRequests
        songRequests={projectSubmission.songRequests.filter((songRequest) => {
          return songRequest.matches.some(
            (match) => match.matchState === "APPROVED_BY_MUSICIAN",
          );
        })}
        status="ACCEPTED"
      />
      <SongRequests
        songRequests={projectSubmission.songRequests.filter((songRequest) => {
          return (
            songRequest.matches.length === 0 ||
            songRequest.matches.every(
              (match) =>
                match.matchState === "REJECTED_BY_MEDIA_MAKER" ||
                match.matchState === "REJECTED_BY_MUSICIAN",
            )
          );
        })}
        status="NO_MATCHES"
      />
    </div>
  );
}
