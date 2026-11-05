// Deliberately not a "use client" module: the route pages (server components)
// import SidebarTab, and enums exported from client modules don't survive
// that boundary.
import type { ReactNode } from "react";
import Link from "next/link";

import SongTabIcon from "../../../svg/homepage/admin/SongTabIcon";
import SubmissionTabIcon from "../../../svg/homepage/admin/SubmissionTabIcon";
import UsersTabIcon from "../../../svg/homepage/admin/UsersTabIcon";

export enum SidebarTab {
  SUBMISSIONS = "submissions",
  SONGS = "songs",
  USERS = "users",
}

/** Each tab is its own route so a refresh keeps you on the same page. */
const sidebarTabHref: Record<SidebarTab, string> = {
  [SidebarTab.SUBMISSIONS]: "/home",
  [SidebarTab.SONGS]: "/home/songs",
  [SidebarTab.USERS]: "/home/users",
};

/**
 * Bar that contains navigation to different pages on the right
 */
export default function SideBar({
  activeTab,
  isAdminView,
}: {
  activeTab: SidebarTab;
  isAdminView: boolean;
}) {
  return (
    <div className="lg:h-screen-full flex w-full flex-row items-center rounded-[24px] bg-gray-100 px-[16px] py-[12px] shadow-card-light lg:w-auto lg:max-w-[207px] lg:flex-1 lg:flex-col lg:items-start lg:pt-[32px] lg:pb-[32px] dark:bg-dark-gray-600">
      <div className="flex flex-row gap-[8px] max-lg:w-full lg:flex-col lg:gap-[4px]">
        <SideBarEntry
          active={activeTab === SidebarTab.SUBMISSIONS}
          text={"Submissions"}
          icon={
            <SubmissionTabIcon active={activeTab === SidebarTab.SUBMISSIONS} />
          }
          href={sidebarTabHref[SidebarTab.SUBMISSIONS]}
        />
        <SideBarEntry
          active={activeTab === SidebarTab.SONGS}
          text={"Songs"}
          icon={<SongTabIcon active={activeTab === SidebarTab.SONGS} />}
          href={sidebarTabHref[SidebarTab.SONGS]}
        />
        {isAdminView && (
          <SideBarEntry
            active={activeTab === SidebarTab.USERS}
            text={"Users"}
            icon={<UsersTabIcon active={activeTab === SidebarTab.USERS} />}
            href={sidebarTabHref[SidebarTab.USERS]}
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
  href,
}: {
  active: boolean;
  text: string;
  icon: ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`${active ? "bg-green-400 text-white" : "bg-white text-dark-gray-500 dark:bg-dark-gray-600 dark:text-gray-200"} items-center rounded-[8px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] hover:cursor-pointer max-lg:flex-1 lg:w-[175px] lg:pr-[32px]`}
    >
      <div className="flex flex-row gap-[8px] max-lg:justify-center">
        {/* Icons are dropped on phones so all tabs fit on one row */}
        <span className="max-sm:hidden">{icon}</span>
        <p
          className={`text-body2 ${active ? "text-white" : "text-dark-gray-500 dark:text-gray-200"} leading-[128%]`}
        >
          {text}
        </p>
      </div>
    </Link>
  );
}
