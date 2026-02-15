"use client";

import { useState } from "react";
import SideBar, { SidebarTabs } from "./components/staff/SideBar";
import ProjectsSubpage from "./components/staff/ProjectsSubpage";
import SongsSubpage from "./components/staff/SongsSubpage";

export default function ModeratorLanding() {
  const [activeTab, setActiveTab] = useState<SidebarTabs>(
    SidebarTabs.SUBMISSIONS,
  );
  return (
    <div className="flex flex-row gap-[24px] w-[1360px]">
      <SideBar
        activeTab={activeTab}
        setActiveTab={(newTab: SidebarTabs) => {
          if (newTab === SidebarTabs.USERS) {
            // do nothing since moderators don't have access to users page
            return;
          }
          setActiveTab(newTab);
        }}
        isAdminView={false}
      />
      {activeTab === SidebarTabs.SUBMISSIONS ? (
        <ProjectsSubpage />
      ) : (
        <SongsSubpage />
      )}
    </div>
  );
}
