"use client";

import type { ReactNode } from "react";

import SongTabIcon from "../../../svg/homepage/admin/SongTabIcon";
import SubmissionTabIcon from "../../../svg/homepage/admin/SubmissionTabIcon";
import UsersTabIcon from "../../../svg/homepage/admin/UsersTabIcon";

export enum SidebarTab {
  SUBMISSIONS = "submissions",
  SONGS = "songs",
  USERS = "users",
}

/**
 * Bar that contains navigation to different pages on the right
 */
export default function SideBar({
  activeTab,
  setActiveTab,
  isAdminView,
}: {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  isAdminView: boolean;
}) {
  return (
    <div className="flex flex-row items-center px-[16px] py-[12px] w-full bg-gray-100 dark:bg-dark-gray-600 shadow-[0_2px_6px_0_#ECE6DF] rounded-[24px] lg:flex-col lg:items-start lg:flex-1 lg:max-w-[207px] lg:h-screen-full lg:pt-[32px] lg:pb-[32px] lg:w-auto">
      <div className="flex flex-row gap-[8px] lg:flex-col lg:gap-[4px]">
        <SideBarEntry
          active={activeTab === SidebarTab.SUBMISSIONS}
          text={"Submissions"}
          icon={
            <SubmissionTabIcon active={activeTab === SidebarTab.SUBMISSIONS} />
          }
          onClick={() => setActiveTab(SidebarTab.SUBMISSIONS)}
        />
        <SideBarEntry
          active={activeTab === SidebarTab.SONGS}
          text={"Songs"}
          icon={<SongTabIcon active={activeTab === SidebarTab.SONGS} />}
          onClick={() => setActiveTab(SidebarTab.SONGS)}
        />
        {isAdminView && (
          <SideBarEntry
            active={activeTab === SidebarTab.USERS}
            text={"Users"}
            icon={<UsersTabIcon active={activeTab === SidebarTab.USERS} />}
            onClick={() => setActiveTab(SidebarTab.USERS)}
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
      className={`${active ? "bg-green-400 text-white" : "bg-white dark:bg-dark-gray-600 text-dark-gray-500 dark:text-gray-200"} items-center pl-[8px] pt-[8px] pb-[8px] pr-[8px] rounded-[8px] hover:cursor-pointer lg:pr-[32px] lg:w-[175px]`}
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
