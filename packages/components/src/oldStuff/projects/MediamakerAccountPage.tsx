"use client";

import { useState } from "react";

import { trpc } from "@good-dog/trpc/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@good-dog/ui/tabs";

import MediamakerOverview from "./MediamakerOverview";
import MediamakerProjects from "./MediamakerProjects";

export default function MediamakerAccountPage() {
  type ActiveTab = "overview" | "projects";
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [data] = trpc.mediamakerProjects.useSuspenseQuery(); // should get all projects for this user

  return (
    <main className="mx-auto min-h-screen bg-white">
      <h1 className="my-6 px-8 text-2xl font-bold">Manage Your Account</h1>
      <Tabs
        defaultValue="projects"
        className="mb-8"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ActiveTab)}
      >
        <div className="px-5">
          <TabsList className="bg-slate-100 focus:border-black">
            <TabsTrigger
              value="overview"
              className="border-b-2 border-transparent text-gray-600 hover:text-black hover:underline focus:text-black"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="border-b-2 border-transparent text-gray-600 hover:text-black hover:underline focus:text-black"
            >
              Projects
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview">
          <div className="py-4">
            <MediamakerOverview />
          </div>
        </TabsContent>
        <TabsContent value="projects">
          <MediamakerProjects data={data.projects} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
