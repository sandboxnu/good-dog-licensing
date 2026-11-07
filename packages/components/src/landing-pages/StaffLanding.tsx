"use client";

import ProjectsSubpage from "./components/staff/ProjectsSubpage";
import SideBar, { SidebarTab } from "./components/staff/SideBar";
import SongsSubpage from "./components/staff/SongsSubpage";
import UserSubPage from "./components/staff/UserSubPage";

/**
 * Admin/moderator dashboard. Each tab lives at its own route (see SideBar),
 * so the page renders whichever tab its route asks for.
 */
export default function StaffLanding({
  activeTab,
  isAdminView,
}: {
  activeTab: SidebarTab;
  isAdminView: boolean;
}) {
  return (
    <div className="flex w-full flex-col gap-[24px] lg:flex-row">
      <SideBar activeTab={activeTab} isAdminView={isAdminView} />
      <div className="w-full">
        {activeTab === SidebarTab.SUBMISSIONS ? (
          <ProjectsSubpage />
        ) : activeTab === SidebarTab.SONGS ? (
          <SongsSubpage isAdminView={isAdminView} />
        ) : (
          isAdminView && <UserSubPage />
        )}
      </div>
    </div>
  );
}
