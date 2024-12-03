"use client";

import { useState } from "react";

import type { GetProcedureOutput } from "@good-dog/trpc/utils";
import { DataTable } from "@good-dog/components/admin/DataTable";
import Loading from "@good-dog/components/loading/Loading";
import { trpc } from "@good-dog/trpc/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@good-dog/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@good-dog/ui/tabs";

import NotFound from "~/not-found";

type AdminDataTypes = GetProcedureOutput<"adminData">;
interface DataColumn<T extends keyof AdminDataTypes> {
  accessorKey: keyof AdminDataTypes[T][number];
  header: string;
  cell?: (value: AdminDataTypes[T][keyof AdminDataTypes[T]]) => JSX.Element;
}

const columns = {
  users: [
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "stageName", header: "Stage Name" },
    { accessorKey: "isSongWriter", header: "Songwriter?" },
    { accessorKey: "isAscapAffiliated", header: "ASCAP Affiliated?" },
    { accessorKey: "isBmiAffiliated", header: "BMI Affiliated?" },
    { accessorKey: "createdAt", header: "Date of Creation" },
    { accessorKey: "updatedAt", header: "Date Last Updated" },
  ],
  groups: [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "createdAt", header: "Date of Creation" },
    { accessorKey: "updatedAt", header: "Date Last Updated" },
  ],
  groupInvites: [
    { accessorKey: "email", header: "Email" },
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "stageName", header: "Stage Name" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "isSongWriter", header: "Songwriter?" },
    { accessorKey: "isAscapAffiliated", header: "ASCAP Affiliated?" },
    { accessorKey: "isBmiAffiliated", header: "BMI Affiliated?" },
    { accessorKey: "createdAt", header: "Date of Creation" },
  ],
} as const satisfies { [T in keyof AdminDataTypes]: DataColumn<T>[] };

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const { data, isPending, isError } = trpc.adminData.useQuery();
  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return NotFound;
  }
  const userData = data.users;
  const groupData = data.groups;
  const groupInvitesData = data.groupInvites;

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
                  <DataTable columns={columns.users} data={userData} />
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
                  <DataTable columns={columns.groups} data={groupData} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className="text-3xl" value="invites">
              <Card>
                <CardHeader>
                  <CardTitle>Invites</CardTitle>
                  <CardDescription className="text-xl">
                    Manage pending invitations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={columns.groupInvites}
                    data={groupInvitesData}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
