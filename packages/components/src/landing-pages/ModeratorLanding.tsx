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
    <div className="flex w-[1360px] flex-row gap-[24px]">
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
      {activeTab === SidebarTab.SUBMISSIONS ? (
        <ProjectsSubpage />
      ) : (
        <SongsSubpage />
      )}
    </div>
  );
}
