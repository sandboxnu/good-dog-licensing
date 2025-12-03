"use client";
import type { ReactNode} from "react";
import { useState } from "react";
import SubmissionTabIcon from "../svg/homepage/admin/SubmissionTabIcon";
import SongTabIcon from "../svg/homepage/admin/SongTabIcon";
import UsersTabIcon from "../svg/homepage/admin/UsersTabIcon";
import Header from "./components/Header";
import { trpc } from "@good-dog/trpc/client";
import type {
  ProjectSubmissionWithSongRequestAndMatches,
} from "../../utils/getStatusFromProject";
import getStatusFromProject from "../../utils/getStatusFromProject";

export default function AdminLanding() {
  const [activeTab, setActiveTab] = useState<"submissions" | "songs" | "users">(
    "submissions",
  );
  return (
    <div className="flex flex-row gap-[24px] w-[1360px]">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "submissions" ? (
        <Submissions />
      ) : activeTab === "songs" ? (
        <Songs />
      ) : activeTab === "users" ? (
        <Users />
      ) : (
        <></>
      )}
    </div>
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

function Submissions() {
  const [data] = trpc.mediamakerProjects.useSuspenseQuery();
  const [activeStatuses, setActiveStatuses] = useState<
    ("not started" | "in progress" | "in review" | "completed" | "unknown")[]
  >(["not started"]);

  const toggleActiveStatus = (
    status:
      | "not started"
      | "in progress"
      | "in review"
      | "completed"
      | "unknown",
  ) => {
    if (activeStatuses.includes(status)) {
      setActiveStatuses(activeStatuses.filter((s) => s !== status));
    } else {
      setActiveStatuses([...activeStatuses, status]);
    }
  };

  return (
    <div className="flex flex-col gap-[32px]">
      <Header
        title={"Submissions"}
        subtitle={"Pending project submissions"}
        requestPath={""}
      />
      <div className="flex flex-row gap-[24px]">
        <SubmissionStatusTab
          title={"Not started"}
          subtitle={"Projects that aren't assigned"}
          number={
            data.projects.filter(
              (project) => getStatusFromProject(project) === "not started",
            ).length
          }
          active={activeStatuses.includes("not started")}
          onClick={() => toggleActiveStatus("not started")}
        />
        <SubmissionStatusTab
          title={"In progress"}
          subtitle={"Projects currently being worked on"}
          number={
            data.projects.filter(
              (project) => getStatusFromProject(project) === "in progress",
            ).length
          }
          active={activeStatuses.includes("in progress")}
          onClick={() => toggleActiveStatus("in progress")}
        />
        <SubmissionStatusTab
          title={"In review"}
          subtitle={"Projects currently being reviewed"}
          number={
            data.projects.filter(
              (project) => getStatusFromProject(project) === "in review",
            ).length
          }
          active={activeStatuses.includes("in review")}
          onClick={() => toggleActiveStatus("in review")}
        />
        <SubmissionStatusTab
          title={"Completed"}
          subtitle={"Completed projects"}
          number={
            data.projects.filter(
              (project) => getStatusFromProject(project) === "completed",
            ).length
          }
          active={activeStatuses.includes("completed")}
          onClick={() => toggleActiveStatus("completed")}
        />
      </div>
      <SubmissionTable
        data={data.projects.filter((project) =>
          activeStatuses.includes(getStatusFromProject(project)),
        )}
      />
    </div>
  );
}

function SubmissionTable({
  data,
}: {
  data: ProjectSubmissionWithSongRequestAndMatches[];
}) {
  return (
    <div
      className="pt-[32px] pr-[24px] pl-[24px] pb-[48px] flex flex-col gap-[24px] self-stretch rounded-[24px] bg-gray-100 dark:bg-dark-gray-600 shadow-[0_2px_6px_0_#ECE6DF]
"
    >
      <div className="flex flex-col">
        <div className="p-[16px] bg-cream-100 rounded-t-[8px] flex flex-row gap-[50px] border-[0.2px] border-solid border-cream-400 items-center">
          <p className="flex-1">Project Name</p>
          <p className="flex-1">Project Description</p>
          <p className="flex-1">Media Maker</p>
          <p className="flex-1">Deadline</p>
          <p className="flex-1">Assignee</p>
          <p className="flex-1">Status</p>
        </div>

        {data.map(
          (project: ProjectSubmissionWithSongRequestAndMatches, key) => {
            return (
              <div
                key={key}
                className="p-[16px] bg-white flex flex-row gap-[50px] border-[0.2px] border-t-0 border-solid border-cream-400 items-center"
              >
                <p className="flex-1">{project.projectTitle}</p>
                <p className="flex-1">{project.description}</p>
                <p className="flex-1">
                  {project.projectOwner.firstName +
                    " " +
                    project.projectOwner.lastName}
                </p>
                <p className="flex-1">
                  {project.createdAt.toLocaleDateString("en-GB")}
                </p>
                <p className="flex-1">Assignees</p>
                <p className="flex-1">Status</p>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}

function Songs() {
  return <p></p>;
}

function Users() {
  return <p></p>;
}

function SideBar({
  activeTab,
  setActiveTab,
}: {
  activeTab: "submissions" | "songs" | "users";
  setActiveTab: Function;
}) {
  return (
    <div className="flex bg-white flex-1 w-[207px] h-[776px] pt-[32px] pl-[16px] pr-[16px] shadow-[0_2px_6px_0_#ECE6DF] rounded-[24px] h-[40px]">
      <div className="flex flex-col gap-[4px]">
        <SideBarEntry
          active={activeTab === "submissions"}
          text={"Submissions"}
          icon={<SubmissionTabIcon active={activeTab === "submissions"} />}
          onClick={() => setActiveTab("submissions")}
        />
        <SideBarEntry
          active={activeTab === "songs"}
          text={"Songs"}
          icon={<SongTabIcon active={activeTab === "songs"} />}
          onClick={() => setActiveTab("songs")}
        />
        <SideBarEntry
          active={activeTab === "users"}
          text={"Users"}
          icon={<UsersTabIcon active={activeTab === "users"} />}
          onClick={() => setActiveTab("users")}
        />
      </div>
    </div>
  );
}

function SideBarEntry({
  active,
  text,
  icon,
  onClick,
}: {
  active: boolean;
  text: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <div
      className={`${active ? "bg-[#07634C] text-[#FFFFFF]" : "bg-white text-black"} items-center pl-[8px] pt-[8px] pb-[8px] pr-[32px] w-[175px] rounded-[8px]`}
      onClick={onClick}
    >
      <div className="flex flex-row gap-[8px]">
        {icon}
        <p
          className={`text-body2 ${active ? "text-white" : "text-black"} leading-[128%]`}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
