"use client";

import type { ReactNode } from "react";
import SongTabIcon from "../../../svg/homepage/admin/SongTabIcon";
import SubmissionTabIcon from "../../../svg/homepage/admin/SubmissionTabIcon";
import UsersTabIcon from "../../../svg/homepage/admin/UsersTabIcon";

/**
 * Bar that contains navigation to different pages on the right
 */
export default function SideBar({
  activeTab,
  setActiveTab,
  isAdminView,
}: {
  activeTab: "submissions" | "songs" | "users";
  setActiveTab: (tab: "submissions" | "songs" | "users") => void;
  isAdminView: boolean;
}) {
  return (
    <div className="flex bg-gray-100 bg-dark-gray-600 flex-1 w-[207px] h-[776px] pt-[32px] pl-[16px] pr-[16px] shadow-[0_2px_6px_0_#ECE6DF] rounded-[24px] h-[40px]">
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
        {isAdminView && (
          <SideBarEntry
            active={activeTab === "users"}
            text={"Users"}
            icon={<UsersTabIcon active={activeTab === "users"} />}
            onClick={() => setActiveTab("users")}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Used to navigate between different pages on the left sidebar.  Pages include submissions, songs, and users.
 */
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
      className={`${active ? "bg-green-400 text-white" : "bg-white dark:bg-dark-gray-600 text-dark-gray-500 dark:text-gray-200"} items-center pl-[8px] pt-[8px] pb-[8px] pr-[32px] w-[175px] rounded-[8px]`}
      onClick={onClick}
    >
      <div className="flex flex-row gap-[8px]">
        {icon}
        <p
          className={`text-body2 ${active ? "text-white" : "text-dark-gray-500 dark:text-gray-200"} leading-[128%]`}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
