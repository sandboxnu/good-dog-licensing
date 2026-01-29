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
import ProfileIcon from "../svg/ProfileIcon";
import { ChevronDown, ChevronLeft, ChevronRight, Link } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@good-dog/ui/dropdown-menu";
import FilterIcon from "../svg/FilterIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../base/Select";

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
    ("Not assigned" | "In progress" | "In review" | "Matched")[]
  >(["Not assigned"]);

  const toggleActiveStatus = (
    status:
      | "Not assigned"
      | "In progress"
      | "In review"
      | "Matched"
  ) => {
    if (activeStatuses.includes(status)) {
      setActiveStatuses(activeStatuses.filter((s) => s !== status));
    } else {
      setActiveStatuses([...activeStatuses, status]);
    }
  };

  return (
    <div className="flex flex-col gap-[32px]">
      <ExampleFunction/>
      <DropdownMenu/>
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
      />
    </div>
  );
}

function SubmissionTable({
  data,
}: {
  data: ProjectSubmissionWithSongRequestAndMatches[];
}) {
 const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!data) {
    return <p>Loading...</p>;
  }

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div
      className="pt-[32px] pr-[24px] pl-[24px] pb-[48px] flex flex-col gap-[24px] self-stretch rounded-[24px] bg-gray-100 dark:bg-dark-gray-600 shadow-[0_2px_6px_0_#ECE6DF]
"
    >
      <FilterDropdown/>
<div className="flex flex-col">
  <div className="p-[16px] bg-cream-100 rounded-t-[8px] grid grid-cols-7 gap-4 border-[0.2px] border-solid border-cream-400 items-center">
    <p>Project Name</p>
    <p>Project Description</p>
    <p>Media Maker</p>
    <p>Date submitted</p>
    <p>Deadline</p>
    <p>Assignee</p>
    <p>Status</p>
  </div>

  {data.map(
    (project: ProjectSubmissionWithSongRequestAndMatches, key) => {
      return (
        <div
          key={key}
          className={`p-[16px] bg-white grid grid-cols-7 gap-4 border-[0.2px] border-t-0 border-solid border-cream-400 items-center ${key === data.length - 1 ? "rounded-b-[8px]" : ""}`}
        >
          <p>{project.projectTitle}</p>
          <p>{project.description}</p>
          <p>
            {project.projectOwner.firstName +
              " " +
              project.projectOwner.lastName}
          </p>
          <p>
            {project.createdAt.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          <p>
            {project.deadline.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          <div>assigned pnr rep</div>
          <div>
            <AdminStatusIndicator status={getStatusFromProject(project)} />
          </div>
        </div>
      );
    },
  )}
</div>   
<div className="flex p-[8px] items-center gap-[4px] self-center">
  <ChevronLeft onClick={() => currentPage > 1 ? setCurrentPage(prev => Math.max(prev - 1, 1)) : null} className={ currentPage > 1 ? "text-green-500 dark:text-mint-200" : "text-gray-400"}/>
  <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex h-[32px] items-center gap-[8px] px-2 rounded  ${
                  currentPage === page
                    ? 'bg-green-400 dark:bg-green-300 text-mint-200'
                    : 'bg-transparent text-green-200 dark:text-mint-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <div></div>
    <ChevronRight onClick={() => currentPage != totalPages ? setCurrentPage(prev => Math.min(prev + 1, totalPages)): null} className={ currentPage != totalPages ? "text-green-500 dark:text-mint-200" : "text-gray-400"}/>
          
</div>
    </div> 
  );
}

function Songs() {
  return <p></p>;
}

function Users() {
  return <p></p>
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


function AdminStatusIndicator({
  status,
}: {
  status: "In progress" | "Matched" | "In review" | "Not assigned";
}) {
  const statusColors = {
    "Matched": "bg-grass-green-50 dark:bg-grass-green-500 text:grass-green-500 dark:text-grass-green-50",
    "In progress": "bg-blue-50 dark:bg-blue-300 text-blue-500 dark:text-blue-50",
    "In review": "bg-yellow-100 dark:bg-yellow-400 text-yellow-500 dark:text-yellow-100",
    "Not assigned": "bg-gray-300 dark:bg-gray-400 text-gray-500",
  };

  return (
    <div className={`h-[24px] w-[100px] p-[4px] text-center rounded ${statusColors[status]}`}>
      <p className="text-dark-gray-500">{status}</p>
    </div>
  );
}   

export function ExampleFunction() {
  return <Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>

}

export function FilterDropdown() {
  return (
<Select>
  <SelectTrigger className="w-[180px] justify-between">
    <div className="flex items-center text-gray-400 gap-[4px]">
<FilterIcon/>
            Filter 
    </div>
    
   
  </SelectTrigger>
  <SelectContent  align="end"
        side="bottom"
        className="w-[296px] gap-2 py-4 px-2 bg-white border-green-300 flex flex-col gap-2">
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>
  );
}


