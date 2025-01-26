"use client";

import { useState } from "react";

import { trpc } from "@good-dog/trpc/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@good-dog/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@good-dog/ui/tabs";

import { DataTable } from "./DataTable";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [data] = trpc.adminData.useSuspenseQuery();

  const userData = data.users;
  const groupData = data.groups;

  return (
    <div className="bg-good-dog-violet pb-10">
      <div className="mx-10">
        <h1 className="mb-6 text-7xl font-bold text-white">Admin Dashboard</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger className="text-xl" value="users">
              Users
            </TabsTrigger>
            <TabsTrigger className="text-xl" value="groups">
              Groups
            </TabsTrigger>
            <TabsTrigger className="text-xl" value="invites">
              Invites
            </TabsTrigger>
          </TabsList>
          <div className="pt-2">
            <TabsContent className="text-3xl" value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Users</CardTitle>
                  <CardDescription className="text-xl">
                    Manage user accounts in the system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable table="users" data={userData} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className="text-3xl" value="groups">
              <Card>
                <CardHeader>
                  <CardTitle>Groups</CardTitle>
                  <CardDescription className="text-xl">
                    Manage user groups and permissions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable table="groups" data={groupData} />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
