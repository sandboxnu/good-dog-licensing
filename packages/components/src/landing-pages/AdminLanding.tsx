"use client";
import SideBar, { SidebarTab } from "./components/staff/SideBar";
import SongsSubpage from "./components/staff/SongsSubpage";
import { useState } from "react";
import ProjectsSubpage from "./components/staff/ProjectsSubpage";
import UserSubPage from "./components/staff/UserSubPage";

export default function AdminLanding() {
  const [activeTab, setActiveTab] = useState<SidebarTab>(
    SidebarTab.SUBMISSIONS,
  );
  return (
    <div className="flex flex-row gap-[24px] w-[1360px]">
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
