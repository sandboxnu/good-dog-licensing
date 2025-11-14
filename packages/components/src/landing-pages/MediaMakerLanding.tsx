"use client";
import { trpc } from "@good-dog/trpc/client";
import Card from "../base/Card";
import Header from "./components/Header";
import StatusIndicator from "../base/StatusIndicator";
import { MatchState } from "@good-dog/db";
import EmptyMessage from "./components/EmptyMessage";
import EmptyFolder from "../svg/homepage/EmptyFolder";

export default function MediaMakerLanding() {
  const [data] = trpc.mediamakerProjects.useSuspenseQuery();

  return (
    <div className="flex flex-col gap-[32px] align-start w-full">
      <Header
        title={"Project requests"}
        subtitle={"This is where you view and manage your project requests"}
        requestPath={"/project-submission"}
      />
      {data.projects.length === 0 && (
        <EmptyMessage
          title={"Find projects requests here"}
          description="Once you submit a project request, you can track its status, view details, and manage all your requests here."
          icon={<EmptyFolder />}
        />
      )}
      {data.projects.length > 0 && (
        <div className="flex flex-wrap justify-start gap-4 mx-auto max-w-fit pb-[36px]">
          {data.projects.map((project, key) => {
            // New matches are sent to media maker for approval
            const actionRequired = project.songRequests.some((songReq) =>
              songReq.matches.some(
                (match) => match.matchState === MatchState.NEW,
              ),
            );
            // Something approved by media maker but not by musician
            const pendingApproval = project.songRequests.some((songReq) =>
              songReq.matches.some(
                (match) => match.matchState === MatchState.SONG_REQUESTED,
              ),
            );

            // Complete when all requests in approved by musician state
            const completed = project.songRequests.every((scene) =>
              scene.matches.every(
                (match) => match.matchState === MatchState.APPROVED_BY_MUSICIAN,
              ),
            );

            const matchSize = project.songRequests.reduce((prev, song) => {
              return prev + song.matches.length;
            }, 0);

            const indicator: {
              variant: "error" | "success" | "warning" | "gray";
              text: string;
            } = actionRequired
              ? { variant: "error", text: "Action required" }
              : pendingApproval
                ? { variant: "warning", text: "Pending approval" }
                : matchSize === 0
                  ? { variant: "gray", text: "Project submitted" }
                  : completed
                    ? { variant: "success", text: "Completed" }
                    : { variant: "warning", text: "In progress" };

            return (
              <Card
                size="small"
                title={project.projectTitle}
                subheader={project.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                children={
                  <div className="flex flex-col h-full gap-[24px]">
                    <p className="body3 text-dark-gray-100 dark:text-dark-gray-100 text-base font-normal leading-tight break-words line-clamp-[3]">
                      {project.description}
                    </p>
                    <div className="absolute bottom-[24px]">
                      <StatusIndicator
                        variant={indicator.variant}
                        text={indicator.text}
                      />
                    </div>
                  </div>
                }
                key={key}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
