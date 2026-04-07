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
    <div className="flex h-[40px] h-[776px] w-[207px] flex-1 rounded-[24px] bg-gray-100 pl-[16px] pr-[16px] pt-[32px] shadow-[0_2px_6px_0_#ECE6DF] dark:bg-dark-gray-600">
      <div className="flex flex-col gap-[4px]">
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
      className={`${active ? "bg-green-400 text-white" : "bg-white text-dark-gray-500 dark:bg-dark-gray-600 dark:text-gray-200"} w-[175px] items-center rounded-[8px] pb-[8px] pl-[8px] pr-[32px] pt-[8px]`}
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
