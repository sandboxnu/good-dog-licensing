"use client";

import { useState } from "react";
import SideBar from "./components/staff/SideBar";
import Projects from "./components/staff/ProjectsSubpage";
import Songs from "./components/staff/SongsSubpage";

export default function ModeratorLanding() {
  const [activeTab, setActiveTab] = useState<"submissions" | "songs" | "users">(
    "submissions",
  );
  return (
    <div className="flex flex-row gap-[24px] w-[1360px]">
      <SideBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminView={false}
      />
      {activeTab === "submissions" ? <Projects /> : <Songs />}
    </div>
  );
}
