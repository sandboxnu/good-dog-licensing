"use client";
import { useState } from "react";
import getStatusFromProject from "../../../../utils/getStatusFromProject";
import Header from "../Header";
import {
  TableEmptyMessage,
  TableHeaderFormatting,
  TableOuterFormatting,
  TableRowFormatting,
} from "./TableFormatting";
import { trpc } from "@good-dog/trpc/client";
import ProjectDrawer from "./ProjectDrawer";
import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { useRouter, useSearchParams } from "next/navigation";

type ProjectSubmissionType =
  GetProcedureOutput<"allProjects">["projects"][number];

export type ProjectStatus =
  | "Not assigned"
  | "In progress"
  | "In review"
  | "Matched";

export default function ProjectsSubpage() {
  const [data] = trpc.allProjects.useSuspenseQuery();
  const [activeStatuses, setActiveStatuses] = useState<ProjectStatus[]>([
    "Not assigned",
  ]);

  const toggleActiveStatus = (status: ProjectStatus) => {
    if (activeStatuses.includes(status)) {
      setActiveStatuses(activeStatuses.filter((s) => s !== status));
    } else {
      setActiveStatuses([...activeStatuses, status]);
    }
  };

  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("projectId");

  const selectedProject =
    data.projects.find((project) => project.projectId === projectIdFromUrl) ??
    null;

  return (
    <div className="flex flex-col gap-[32px]">
      <Header
        title={"Submissions"}
        subtitle={"Pending project submissions"}
        requestPath={""}
        buttonContent="Invite"
      />

      <div className="flex flex-row gap-[24px]">
        <SubmissionStatusTab
          title={"Not assigned"}
          subtitle={"Projects that aren't assigned"}
          number={
            data.projects.filter(
              (project) => getStatusFromProject(project) === "Not assigned",
            ).length
          }
          active={activeStatuses.includes("Not assigned")}
          onClick={() => toggleActiveStatus("Not assigned")}
        />
        <SubmissionStatusTab
          title={"In progress"}
          subtitle={"Projects currently being worked on"}
          number={
            data.projects.filter(
              (project) => getStatusFromProject(project) === "In progress",
            ).length
          }
          active={activeStatuses.includes("In progress")}
          onClick={() => toggleActiveStatus("In progress")}
        />
        <SubmissionStatusTab
          title={"In review"}
          subtitle={"Projects currently being reviewed"}
          number={
            data.projects.filter(
              (project) => getStatusFromProject(project) === "In review",
            ).length
          }
          active={activeStatuses.includes("In review")}
          onClick={() => toggleActiveStatus("In review")}
        />
        <SubmissionStatusTab
          title={"Matched"}
          subtitle={"Matched projects"}
          number={
            data.projects.filter(
              (project) => getStatusFromProject(project) === "Matched",
            ).length
          }
          active={activeStatuses.includes("Matched")}
          onClick={() => toggleActiveStatus("Matched")}
        />
      </div>
      <SubmissionTable
        data={data.projects.filter((project) =>
          activeStatuses.includes(getStatusFromProject(project)),
        )}
        selectedProject={selectedProject}
      />
    </div>
  );
}

function SubmissionTable({
  data,
  selectedProject,
}: {
  data: ProjectSubmissionType[];
  selectedProject: ProjectSubmissionType | null;
}) {
  const router = useRouter();
  return (
    <TableOuterFormatting>
      <div className="flex flex-col">
        <TableHeaderFormatting>
          <p className="dark:text-white">Project Name</p>
          <p className="dark:text-white">Project Description</p>
          <p className="dark:text-white">Status</p>
          <p className="dark:text-white">Media Maker</p>
          <p className="dark:text-white">Date submitted</p>
          <p className="dark:text-white">Deadline</p>
          <p className="dark:text-white">Assignee</p>
        </TableHeaderFormatting>

        {data.map((project: ProjectSubmissionType, key) => {
          return (
            <div
              className="cursor-pointer"
              onClick={() =>
                router.replace(`?projectId=${project.projectId}`, {
                  scroll: false,
                })
              }
            >
              <TableRowFormatting key={key} isLast={key === data.length - 1}>
                <p className="dark:text-white truncate">
                  {project.projectTitle}
                </p>
                <p className="dark:text-white truncate">
                  {project.description}
                </p>
                <div>
                  <AdminStatusIndicator
                    status={getStatusFromProject(project)}
                  />
                </div>
                <p className="dark:text-white truncate">
                  {project.projectOwner.firstName +
                    " " +
                    project.projectOwner.lastName}
                </p>
                <p className="dark:text-white truncate">
                  {project.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="dark:text-white truncate">
                  {project.deadline.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <div className="dark:text-white truncate">+</div>
              </TableRowFormatting>
            </div>
          );
        })}
        {data.length == 0 && <TableEmptyMessage />}
      </div>
      <ProjectDrawer
        projectSubmission={selectedProject}
        open={!!selectedProject}
        onClose={() => router.replace("/home", { scroll: false })}
      />
    </TableOuterFormatting>
  );
}

function SubmissionStatusTab({
  title,
  subtitle,
  number,
  active,
  onClick,
}: {
  title: string;
  subtitle: string;
  number: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`flex flex-1 flex-col p-[16px] gap-[8px] shadow-[0_2px_6px_0_#ECE6DF] rounded-[16px] ${active ? "bg-green-400" : "bg-gray-100"}`}
      onClick={onClick}
    >
      <div className="flex flex-row gap-[8px] items-center">
        <p
          className={`text-body1 font-medium leading-[128%] ${active ? "text-gray-100" : "text-dark-gray-500"}`}
        >
          {title}
        </p>
        <div
          className={`rounded-[4px] flex items-center justify-center h-[16px] w-[23px] ${active ? "bg-grass-green-50" : "bg-gray-500"}`}
        >
          <p
            className={`${active ? "text-dark-gray-500" : "text-gray-100"} text-[14px] font-medium leading-none`}
          >
            {number}
          </p>
        </div>
      </div>
      <p
        className={`text-caption leading-[96%] ${active ? "text-gray-100" : "text-dark-gray-500"}`}
      >
        {subtitle}
      </p>
    </div>
  );
}

/**
 * Indicates which status a project is in.  Used b/c users may select to look at multiple statuses at once.
 */
function AdminStatusIndicator({ status }: { status: ProjectStatus }) {
  const statusColors = {
    Matched:
      "bg-grass-green-50 dark:bg-grass-green-500 text:grass-green-500 dark:text-grass-green-50",
    "In progress":
      "bg-blue-50 dark:bg-blue-300 text-blue-500 dark:text-blue-50",
    "In review":
      "bg-yellow-100 dark:bg-yellow-400 text-yellow-500 dark:text-yellow-100",
    "Not assigned": "bg-gray-300 dark:bg-gray-400 text-gray-500",
  };

  return (
    <div
      className={`h-[24px] w-[100px] p-[4px] text-center rounded ${statusColors[status]}`}
    >
      <p className="text-dark-gray-500">{status}</p>
    </div>
  );
}
