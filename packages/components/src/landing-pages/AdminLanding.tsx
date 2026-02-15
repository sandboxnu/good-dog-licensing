"use client";
import SideBar, { SidebarTabs } from "./components/staff/SideBar";
import SongsSubpage from "./components/staff/SongsSubpage";
import { useState } from "react";
import ProjectsSubpage from "./components/staff/ProjectsSubpage";
import UserSubPage from "./components/staff/UserSubPage";

export default function AdminLanding() {
  const [activeTab, setActiveTab] = useState<SidebarTabs>(
    SidebarTabs.SUBMISSIONS,
  );
  return (
    <div className="flex flex-row gap-[24px] w-[1360px]">
      <SideBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminView={true}
      />
      {activeTab === SidebarTabs.SUBMISSIONS ? (
        <ProjectsSubpage />
      ) : activeTab === SidebarTabs.SONGS ? (
        <SongsSubpage />
      ) : (
        <UserSubPage />
      )}
    </div>
  );
}
