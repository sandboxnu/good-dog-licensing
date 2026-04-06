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
    <div className="flex w-[1360px] flex-row gap-[24px]">
      <SideBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminView={true}
      />
      {activeTab === SidebarTab.SUBMISSIONS ? (
        <ProjectsSubpage />
      ) : activeTab === SidebarTab.SONGS ? (
        <SongsSubpage />
      ) : (
        <UserSubPage />
      )}
    </div>
  );
}
