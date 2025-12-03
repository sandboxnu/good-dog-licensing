"use client";

import { MatchState } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/client";

import Card from "../base/Card";
import StatusIndicator from "../base/StatusIndicator";
import EmptyFolder from "../svg/homepage/EmptyFolder";
import EmptyMessage from "./components/EmptyMessage";
import Header from "./components/Header";
import getStatusFromProject from "../../utils/getStatusFromProject";

export default function MediaMakerLanding() {
  const [data] = trpc.mediamakerProjects.useSuspenseQuery();

  return (
    <div className="align-start flex w-full flex-col gap-[32px]">
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
        <div className="mx-auto flex max-w-fit flex-wrap justify-start gap-4 pb-[36px]">
          {data.projects.map((project, key) => {
            const status = getStatusFromProject(project);

            const indicator: {
              variant: "error" | "success" | "warning" | "gray";
              text: string;
            } =
              status === "in progress"
                ? { variant: "error", text: "Action required" }
                : status === "in review"
                  ? { variant: "warning", text: "Pending approval" }
                  : status === "not started"
                    ? { variant: "gray", text: "Project submitted" }
                    : status === "completed"
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
                  <div className="flex h-full flex-col gap-[24px]">
                    <p className="body3 line-clamp-[3] break-words text-base font-normal leading-tight text-dark-gray-100 dark:text-dark-gray-100">
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
