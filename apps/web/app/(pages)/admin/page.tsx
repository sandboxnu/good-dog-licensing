//dont use use client

// import { HydrateClient, trpc } from "@good-dog/trpc/server";

// export default function AdminPage() {
//   void trpc.user.prefetch();
//   <HydrateClient>{/* your component here */}</HydrateClient>;
// }
"use client";

import { useState } from "react";

import { DataTable } from "@good-dog/components/admin/DataTable";
import { Badge } from "@good-dog/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@good-dog/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@good-dog/ui/tabs";

// Mock data (replace with actual data fetching logic)
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  // Add more mock users...
];

const mockGroups = [
  { id: 1, name: "Administrators", memberCount: 5 },
  { id: 2, name: "Users", memberCount: 100 },
  // Add more mock groups...
];

const mockInvites = [
  {
    id: 1,
    email: "newuser@example.com",
    status: "Pending",
    expiresAt: "2023-12-31",
  },
  {
    id: 2,
    email: "anotheruser@example.com",
    status: "Expired",
    expiresAt: "2023-11-30",
  },
  // Add more mock invites...
];

const columns = {
  users: [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
  ],
  groups: [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "memberCount", header: "Members" },
  ],
  invites: [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "status",
      header: "Status",
      cell: (value: string) => (
        <Badge variant={value === "Pending" ? "default" : "secondary"}>
          {value}
        </Badge>
      ),
    },
    { accessorKey: "expiresAt", header: "Expires At" },
  ],
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="bg-good-dog-violet py-10">
      <div className="mx-10">
        <h1 className="mb-6 text-4xl font-bold text-white">Admin Dashboard</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="invites">Invites</TabsTrigger>
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
                <DataTable columns={columns.users} data={mockUsers} />
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
                <DataTable columns={columns.groups} data={mockGroups} />
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
                <DataTable columns={columns.invites} data={mockInvites} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
