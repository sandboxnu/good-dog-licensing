"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { AdmModProjectStatus } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/client";
import { CREATED_DATE_QUERY } from "@good-dog/trpc/schema";

import { getStatusLabel } from "../../../../utils/enumLabelMapper";
import { search } from "../../../../utils/search";
import Checkbox from "../../../base/Checkbox";
import MultiselectDropdown from "../../../base/MultiselectDropdown";
import SearchBar from "../../../base/SearchBar";
import ProfileIcon from "../../../svg/ProfileIcon";
import Header from "../Header";
import { AssignProjectModal } from "./assign-pm/AssignProjectModal";
import ProjectDrawer from "./ProjectDrawer";
import {
  TableEmptyMessage,
  TableHeaderFormatting,
  TableOuterFormatting,
  TableRowFormatting,
} from "./TableFormatting";
import TableColumnHeader from "./TableColumnHeader";

type ProjectType = GetProcedureOutput<"queryAllProjects">["projects"][number];

const AdmModProjectStatusToSubtitle: Record<AdmModProjectStatus, string> = {
  [AdmModProjectStatus.COMPLETED]: "Matched projects",
  [AdmModProjectStatus.IN_PROGRESS]: "Projects currently being worked on",
  [AdmModProjectStatus.ACTION_NEEDED]: "Projects that need attention",
};

const admModProjectStatusOrder: AdmModProjectStatus[] = [
  AdmModProjectStatus.ACTION_NEEDED,
  AdmModProjectStatus.IN_PROGRESS,
  AdmModProjectStatus.COMPLETED,
];

type SortColumn =
  | "projectName"
  | "projectDescription"
  | "mediaMaker"
  | "dateSubmitted"
  | "deadline"
  | "assignee";

const filterProjects = (
  projects: ProjectType[],
  searchQuery: string,
  status: AdmModProjectStatus,
  sort?: SortColumn,
) => {
  const projectsSortedOrNot = sort
    ? projects.sort((a, b) => {
        switch (sort) {
          case "projectName":
            return a.projectTitle
              .toLocaleLowerCase()
              .localeCompare(b.projectTitle.toLocaleLowerCase());
          case "projectDescription":
            return a.description
              .toLocaleLowerCase()
              .localeCompare(b.description.toLocaleLowerCase());
          case "mediaMaker":
            return a.projectOwner.firstName
              .toLocaleLowerCase()
              .localeCompare(b.projectOwner.firstName.toLocaleLowerCase());
          case "dateSubmitted":
            return a.createdAt.getTime() - b.createdAt.getTime();
          case "deadline":
            return a.deadline.getTime() - b.deadline.getTime();
          case "assignee":
            return (a.projectManager?.firstName ?? "")
              .toLocaleLowerCase()
              .localeCompare(
                (b.projectManager?.firstName ?? "").toLocaleLowerCase(),
              );
        }
      })
    : projects;

  return projectsSortedOrNot.filter(
    (project) =>
      project.admModStatus === status &&
      (search(project.projectTitle, searchQuery) ||
        search(project.projectOwner.firstName, searchQuery) ||
        search(project.projectOwner.lastName, searchQuery) ||
        search(
          project.projectOwner.firstName + " " + project.projectOwner.lastName,
          searchQuery,
        )),
  );
};

export default function ProjectsSubpage() {
  const [activeStatus, setActiveStatus] = useState<AdmModProjectStatus>(
    AdmModProjectStatus.ACTION_NEEDED,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [createdDateQuery, setCreatedDateQuery] = useState<CREATED_DATE_QUERY>(
    CREATED_DATE_QUERY.LAST_365_DAYS,
  );
  const [assignedToMe, setAssignedToMe] = useState<boolean>(false);

  const [sortColumn, setSortColumn] = useState<SortColumn>("dateSubmitted");

  const [allProjects] = trpc.queryAllProjects.useSuspenseQuery({
    createdDateQuery,
    assignedToMe,
  });

  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("projectId");

  const selectedProject =
    allProjects.projects.find(
      (project) => project.projectId === projectIdFromUrl,
    ) ?? null;

  return (
    <div className="flex flex-col gap-[32px]">
      <Header title={"Submissions"} subtitle={"Pending project submissions"} />

      <div className="flex flex-row gap-[24px]">
        {admModProjectStatusOrder.map((status) => (
          <SubmissionStatusTab
            key={status}
            title={getStatusLabel(status)}
            subtitle={AdmModProjectStatusToSubtitle[status]}
            number={
              filterProjects(allProjects.projects, searchQuery, status).length
            }
            active={activeStatus === status}
            onClick={() => setActiveStatus(status)}
          />
        ))}
      </div>
      <TableOuterFormatting>
        <div className="flex flex-row items-center gap-[16px]">
          <div className="w-[300px]">
            <SearchBar
              onChange={setSearchQuery}
              placeholder="Search projects or media makers"
            />
          </div>

          <div className="ml-auto flex flex-row items-center gap-[16px]">
            <div className="w-[220px] min-w-[220px]">
              <MultiselectDropdown
                value={[createdDateQuery]}
                options={[
                  {
                    value: CREATED_DATE_QUERY.LAST_365_DAYS,
                    label: "Last 365 Days",
                  },
                  {
                    value: CREATED_DATE_QUERY.LAST_30_DAYS,
                    label: "Last 30 Days",
                  },
                  {
                    value: CREATED_DATE_QUERY.LAST_90_DAYS,
                    label: "Last 90 Days",
                  },
                  { value: CREATED_DATE_QUERY.ALL_TIME, label: "All Time" },
                ]}
                placeholder="Filter"
                id="createdDateQuery"
                maxCount={1}
                onChange={(newValue) => {
                  const latestValue = newValue[newValue.length - 1];

                  if (latestValue) {
                    setCreatedDateQuery(latestValue as CREATED_DATE_QUERY);
                  }
                }}
              />
            </div>
            <Checkbox
              label="Assigned to me"
              id="assignedToMe"
              checked={assignedToMe}
              onCheckedChange={(checked) => setAssignedToMe(checked)}
            />
          </div>
        </div>
        <SubmissionTable
          data={filterProjects(
            allProjects.projects,
            searchQuery,
            activeStatus,
            sortColumn,
          )}
          selectedProject={selectedProject}
          sortColumn={sortColumn}
          setSortColumn={setSortColumn}
        />
      </TableOuterFormatting>
    </div>
  );
}

function SubmissionTable({
  data,
  selectedProject,
  sortColumn,
  setSortColumn,
}: {
  data: ProjectType[];
  selectedProject: ProjectType | null;
  sortColumn: SortColumn;
  setSortColumn: (newSort: SortColumn) => void;
}) {
  const router = useRouter();
  const [showPMModal, setShowPMModal] = useState(false);
  const [projectBeingAssigned, setProjectBeingAssigned] =
    useState<ProjectType | null>(null);

  const [user] = trpc.user.useSuspenseQuery();

  const utils = trpc.useUtils();
  const assignPmMutation = trpc.assignProjectManager.useMutation({
    onSuccess: async () => {
      await utils.queryAllProjects.invalidate();
    },
  });

  return (
    <>
      {showPMModal && (
        <AssignProjectModal
          open={showPMModal}
          onOpenChange={setShowPMModal}
          onAction={(user) => {
            if (projectBeingAssigned) {
              assignPmMutation.mutate({
                projectId: projectBeingAssigned.projectId,
                projectManagerId: user.userId,
              });
            }
            setShowPMModal(false);
          }}
          assignedPM={projectBeingAssigned?.projectManager ?? null}
        />
      )}

      <div className="flex flex-col">
        <TableHeaderFormatting columnCount={6}>
          <TableColumnHeader
            columnName="Project Name"
            currentSort={sortColumn}
            sortColumn="projectName"
            setSortColumn={setSortColumn}
          />
          <TableColumnHeader
            columnName="Project Description"
            currentSort={sortColumn}
            sortColumn="projectDescription"
            setSortColumn={setSortColumn}
          />
          <TableColumnHeader
            columnName="Media Maker"
            currentSort={sortColumn}
            sortColumn="mediaMaker"
            setSortColumn={setSortColumn}
          />
          <TableColumnHeader
            columnName="Date submitted"
            currentSort={sortColumn}
            sortColumn="dateSubmitted"
            setSortColumn={setSortColumn}
          />
          <TableColumnHeader
            columnName="Deadline"
            currentSort={sortColumn}
            sortColumn="deadline"
            setSortColumn={setSortColumn}
          />
          <TableColumnHeader
            columnName="Assignee"
            currentSort={sortColumn}
            sortColumn="assignee"
            setSortColumn={setSortColumn}
          />
        </TableHeaderFormatting>

        {data.map((project: ProjectType, key) => {
          return (
            <div
              className="cursor-pointer"
              onClick={() =>
                router.replace(`?projectId=${project.projectId}`, {
                  scroll: false,
                })
              }
              key={key}
            >
              <TableRowFormatting
                key={key}
                isLast={key === data.length - 1}
                columnCount={6}
              >
                <p className="truncate dark:text-white">
                  {project.projectTitle}
                </p>
                <p className="truncate dark:text-white">
                  {project.description}
                </p>
                <p className="truncate dark:text-white">
                  {project.projectOwner.firstName +
                    " " +
                    project.projectOwner.lastName}
                </p>
                <p className="truncate dark:text-white">
                  {project.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="truncate dark:text-white">
                  {project.deadline.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <div className="flex pl-[15px]">
                  <button
                    type="button"
                    className="flex h-[28px] w-[28px] items-center justify-center rounded-full border border-dotted border-gray-400 text-gray-400 hover:bg-dark-gray-100 dark:border-gray-300 dark:text-white"
                    aria-label="Assign project"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (user?.role === "ADMIN") {
                        setShowPMModal(true);
                        setProjectBeingAssigned(project);
                      } else {
                        alert(
                          "You are not allowed to change the project manager for this project.",
                        );
                      }
                    }}
                  >
                    {project.projectManager?.firstName ? (
                      <ProfileIcon
                        color="light"
                        size={32}
                        name={project.projectManager.firstName.charAt(0)}
                      />
                    ) : (
                      "+"
                    )}
                  </button>
                </div>
              </TableRowFormatting>
            </div>
          );
        })}
        {data.length == 0 && <TableEmptyMessage />}
      </div>
      {selectedProject && (
        <ProjectDrawer
          projectSubmissionId={selectedProject.projectId}
          open={!!selectedProject}
          onClose={() => router.replace("/home", { scroll: false })}
        />
      )}
    </>
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
      className={`flex flex-1 cursor-pointer flex-col gap-[8px] rounded-[16px] p-[16px] shadow-card-light ${active ? "bg-green-400" : "bg-gray-100"}`}
      onClick={onClick}
    >
      <div className="flex flex-row items-center gap-[8px]">
        <p
          className={`text-body1 font-medium leading-[128%] ${active ? "text-gray-100" : "text-dark-gray-500"}`}
        >
          {title}
        </p>
        <div
          className={`flex h-[16px] w-[23px] items-center justify-center rounded-[4px] ${active ? "bg-grass-green-50" : "bg-gray-500"}`}
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
