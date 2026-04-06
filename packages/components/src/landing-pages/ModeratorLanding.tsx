"use client";

import { useState } from "react";

import ProjectsSubpage from "./components/staff/ProjectsSubpage";
import SideBar, { SidebarTab } from "./components/staff/SideBar";
import SongsSubpage from "./components/staff/SongsSubpage";

export default function ModeratorLanding() {
  const [activeTab, setActiveTab] = useState<SidebarTab>(
    SidebarTab.SUBMISSIONS,
  );
  return (
    <div className="flex flex-col gap-[24px] w-full lg:flex-row">
      <SideBar
        activeTab={activeTab}
        setActiveTab={(newTab: SidebarTab) => {
          if (newTab === SidebarTab.USERS) {
            // do nothing since moderators don't have access to users page
            return;
          }
          setActiveTab(newTab);
        }}
        isAdminView={false}
      />
      <div className="w-full">
        {activeTab === SidebarTab.SUBMISSIONS ? (
          <ProjectsSubpage />
        ) : (
          <SongsSubpage />
        )}
      </div>
    </div>
  );
}
