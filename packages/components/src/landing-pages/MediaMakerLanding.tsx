"use client";

import { MatchState } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/client";

import Card from "../base/Card";
import StatusIndicator from "../base/StatusIndicator";
import EmptyFolder from "../svg/homepage/EmptyFolder";
import EmptyMessage from "./components/EmptyMessage";
import Header from "./components/Header";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import getStatusFromProject from "../../utils/getStatusFromProject";

export default function MediaMakerLanding() {
  const [data] = trpc.mediamakerProjects.useSuspenseQuery();

  const router = useRouter();

  return (
    <div className="align-start flex w-full flex-col gap-[32px]">
      <Header
        title={"Project requests"}
        subtitle={"This is where you view and manage your project requests"}
        requestPath={"/project-submission"} buttonContent={"Request"}      />
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
            const status = getStatusFromProject(project)

            const indicator: {
              variant: "error" | "success" | "warning" | "gray";
              text: string;
            } = status === "in progress"
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
                subheader={
                  "Submitted " +
                  project.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }
                children={
                  <div className="flex flex-col gap-[24px]">
                    <p className="body3 line-clamp-[3] break-words text-base font-normal leading-tight text-dark-gray-100 dark:text-dark-gray-100">
                      {project.description}
                    </p>
                    <div className="w-full flex flex-row justify-between">
                      <StatusIndicator
                        variant={indicator.variant}
                        text={indicator.text}
                      />
                      <ChevronRight
                        onClick={() =>
                          router.push(`/project/${project.projectId}`)
                        }
                        className="hover:cursor-pointer"
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
