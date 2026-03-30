"use client";
import { useState } from "react";
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
import ProfileIcon from "../../../svg/ProfileIcon";
import { AssignProjectModal } from "./assign-pm/AssignProjectModal";
import { CREATED_DATE_QUERY } from "@good-dog/trpc/schema";
import { AdmModProjectStatus } from "@good-dog/db";
import { getStatusLabel } from "../../../../utils/enumLabelMapper";
import SearchBar from "../../../base/SearchBar";
import { search } from "../../../../utils/search";
import { Spinner } from "../../../loading/Spinner";
import Checkbox from "../../../base/Checkbox";
import MultiselectDropdown from "../../../base/MultiselectDropdown";

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

const filterProjects = (
  projects: ProjectType[],
  searchQuery: string,
  status: AdmModProjectStatus,
  sort?: "title",
) => {
  const projectsSortedOrNot = sort
    ? projects.sort((a, b) => {
        return a.projectTitle
          .toLocaleLowerCase()
          .localeCompare(b.projectTitle.toLocaleLowerCase());
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

  const allProjectsQuery = trpc.queryAllProjects.useQuery({
    createdDateQuery,
    assignedToMe,
  });

  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("projectId");

  const selectedProject =
    allProjectsQuery.data?.projects.find(
      (project) => project.projectId === projectIdFromUrl,
    ) ?? null;

  return (
    <div className="flex flex-col gap-[32px]">
      <Header
        title={"Submissions"}
        subtitle={"Pending project submissions"}
        requestPath={""}
        buttonContent="Invite"
      />

      <div className="flex flex-row gap-[24px]">
        {admModProjectStatusOrder.map((status) => (
          <SubmissionStatusTab
            key={status}
            title={getStatusLabel(status)}
            subtitle={AdmModProjectStatusToSubtitle[status]}
            number={
              filterProjects(
                allProjectsQuery.data?.projects ?? [],
                searchQuery,
                status,
              ).length
            }
            active={activeStatus === status}
            onClick={() => setActiveStatus(status)}
            isFetching={allProjectsQuery.isFetching}
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
            <div className="min-w-[220px] w-[220px]">
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
            allProjectsQuery.data?.projects ?? [],
            searchQuery,
            activeStatus,
            "title",
          )}
          selectedProject={selectedProject}
          isFetching={allProjectsQuery.isFetching}
          isError={allProjectsQuery.isError}
        />
      </TableOuterFormatting>
    </div>
  );
}

function SubmissionTable({
  data,
  selectedProject,
  isFetching,
  isError,
}: {
  data: ProjectType[];
  selectedProject: ProjectType | null;
  isFetching: boolean;
  isError: boolean;
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
          <p className="dark:text-white">Project Name</p>
          <p className="dark:text-white">Project Description</p>
          <p className="dark:text-white">Media Maker</p>
          <p className="dark:text-white">Date submitted</p>
          <p className="dark:text-white">Deadline</p>
          <p className="dark:text-white">Assignee</p>
        </TableHeaderFormatting>

        {isFetching ? (
          <div className="flex w-full justify-center py-[24px]">
            <Spinner />
          </div>
        ) : isError ? (
          <div className="flex w-full justify-center py-[24px]">
            <p className="text-body1 text-dark-gray-500 dark:text-white">
              Something went wrong while loading projects.
            </p>
          </div>
        ) : (
          data.map((project: ProjectType, key) => {
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
                  <p className="dark:text-white truncate">
                    {project.projectTitle}
                  </p>
                  <p className="dark:text-white truncate">
                    {project.description}
                  </p>
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
                  <div className="flex items-center justify-center pr-[30px]">
                    <button
                      type="button"
                      className="flex h-[28px] w-[28px] items-center justify-center rounded-full border border-dotted border-gray-400 text-gray-400 dark:border-gray-300 dark:text-white hover:bg-dark-gray-100"
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
          })
        )}
        {data.length == 0 && !isFetching && !isError && <TableEmptyMessage />}
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
  isFetching,
}: {
  title: string;
  subtitle: string;
  number: number;
  active: boolean;
  onClick: () => void;
  isFetching: boolean;
}) {
  return (
    <div
      className={`flex flex-1 flex-col p-[16px] gap-[8px] shadow-[0_2px_6px_0_#ECE6DF] rounded-[16px] cursor-pointer ${active ? "bg-green-400" : "bg-gray-100"}`}
      onClick={onClick}
    >
      <div className="flex flex-row gap-[8px] items-center">
        <p
          className={`text-body1 font-medium leading-[128%] ${active ? "text-gray-100" : "text-dark-gray-500"}`}
        >
          {title}
        </p>
        {!isFetching ? (
          <div
            className={`rounded-[4px] flex items-center justify-center h-[16px] w-[23px] ${active ? "bg-grass-green-50" : "bg-gray-500"}`}
          >
            <p
              className={`${active ? "text-dark-gray-500" : "text-gray-100"} text-[14px] font-medium leading-none`}
            >
              {number}
            </p>
          </div>
        ) : (
          <Spinner />
        )}
      </div>
      <p
        className={`text-caption leading-[96%] ${active ? "text-gray-100" : "text-dark-gray-500"}`}
      >
        {subtitle}
      </p>
    </div>
  );
}
