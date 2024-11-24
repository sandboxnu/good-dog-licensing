"use client";

import { useState } from "react";

import { DataTable } from "@good-dog/components/admin/DataTable";
import { trpc } from "@good-dog/trpc/client";
import { GetProcedureOutput } from "@good-dog/trpc/utils";
import { Badge } from "@good-dog/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@good-dog/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@good-dog/ui/tabs";

type AdminDataTypes = GetProcedureOutput<"adminData">;
type DataColumn<T extends keyof AdminDataTypes> = {
  accessorKey: keyof AdminDataTypes[T][number];
  header: string;
  cell?: (value: string) => JSX.Element;
};

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
    return <div>Loading Page</div>;
  }
  if (isError) {
    return <div>Error Page</div>;
  }
  const userData = data.users;
  const groupData = data.groups;
  const groupInvitesData = data.groupInvites;

  return (
    <div className="bg-good-dog-violet py-10">
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
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Manage user accounts in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns.users} data={userData} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <CardTitle>Groups</CardTitle>
                <CardDescription>
                  Manage user groups and permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns.groups} data={groupData} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="invites">
            <Card>
              <CardHeader>
                <CardTitle>Invites</CardTitle>
                <CardDescription>Manage pending invitations.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={columns.groupInvites}
                  data={groupInvitesData}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
