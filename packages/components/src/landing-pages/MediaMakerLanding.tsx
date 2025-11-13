"use client";
import { trpc } from "@good-dog/trpc/client";
import Card from "../base/Card";
import Header from "./components/Header";
import StatusIndicator from "../base/StatusIndicator";
import { MatchState } from "@good-dog/db";
import EmptyMessage from "./components/EmptyMessage";
import EmptyFolder from "../svg/homepage/EmptyFolder";

export default function MediaMakerLanding() {
  const [data] = trpc.mediamakerProjectsWithData.useSuspenseQuery();

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
            let actionRequired = false;
            let pendingApproval = false;
            let completed = true;
            let matchSize = 0;
            for (const scene of req.songRequests) {
              matchSize += scene.matches.length;
              for (const match of scene.matches) {
                // new matches are sent to media maker for approval
                actionRequired =
                  actionRequired || match.matchState === MatchState.NEW;
                // Something approved by media maker but not by musician
                pendingApproval =
                  pendingApproval ||
                  match.matchState === MatchState.SONG_REQUESTED;
                // Complete when all requests in approved by musician state
                completed =
                  completed &&
                  match.matchState === MatchState.APPROVED_BY_MUSICIAN;
              }
            }
            let indicator: {
              variant: "error" | "success" | "warning" | "gray";
              text: string;
            };
            if (actionRequired) {
              indicator = { variant: "error", text: "Action required" };
            } else if (pendingApproval) {
              indicator = { variant: "warning", text: "Pending approval" };
            } else if (matchSize === 0) {
              indicator = { variant: "gray", text: "Project submitted" };
            } else if (completed) {
              indicator = { variant: "success", text: "Completed" };
            } else {
              indicator = { variant: "warning", text: "In progress" };
            }

            return (
              <Card
                size="small"
                title={req.projectTitle}
                subheader={req.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                children={
                  <div className="flex flex-col h-full gap-[24px]">
                    <p className="body3 text-dark-gray-100 dark:text-dark-gray-100 text-base font-normal leading-tight break-words line-clamp-[3]">
                      {req.description}
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
