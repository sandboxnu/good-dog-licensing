"use client";
import SideBar from "./components/staff/SideBar";
import Songs from "./components/staff/SongsSubpage";
import { useState } from "react";
import Users from "./components/staff/UserSubPage";
import Projects from "./components/staff/ProjectsSubpage";

export default function AdminLanding() {
  const [activeTab, setActiveTab] = useState<"submissions" | "songs" | "users">(
    "submissions",
  );
  return (
    <div className="flex flex-row gap-[24px] w-[1360px]">
      <SideBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminView={true}
      />
      {activeTab === "submissions" ? (
        <Projects />
      ) : activeTab === "songs" ? (
        <Songs />
      ) : (
        <Users />
      )}
    </div>
  );
}
