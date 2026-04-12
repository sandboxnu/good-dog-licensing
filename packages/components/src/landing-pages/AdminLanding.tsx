"use client";

import { useState } from "react";

import ProjectsSubpage from "./components/staff/ProjectsSubpage";
import SideBar, { SidebarTab } from "./components/staff/SideBar";
import SongsSubpage from "./components/staff/SongsSubpage";
import UserSubPage from "./components/staff/UserSubPage";

export default function AdminLanding() {
  const [activeTab, setActiveTab] = useState<SidebarTab>(
    SidebarTab.SUBMISSIONS,
  );
  return (
    <div className="flex w-full flex-col gap-[24px] lg:flex-row">
      <SideBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminView={true}
      />
      <div className="w-full">
        {activeTab === SidebarTab.SUBMISSIONS ? (
          <ProjectsSubpage />
        ) : activeTab === SidebarTab.SONGS ? (
          <SongsSubpage />
        ) : (
          <UserSubPage />
        )}
      </div>
    </div>
  );
}
