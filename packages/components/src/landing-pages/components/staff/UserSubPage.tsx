import { trpc } from "@good-dog/trpc/client";
import Header from "../Header";
import { TableHeaderFormatting, TableOuterFormatting, TableRowFormatting } from "./TableFormatting";
import { Role } from "@good-dog/db";
import type {
  User,
} from "@prisma/client";
import { useState } from "react";
import { Controls } from "./Controls";

type DisplayUser = Omit<User, 'hashedPassword'> 
/**
 * User sub-page of admin dashboard.
 */
export default function Users() {
  const [data] = trpc.adminData.useSuspenseQuery();
  return <div className="flex flex-col gap-[32px]">
    <Header
        title={"Users"}
        subtitle={"Subtitle here"}
        requestPath={""}
        buttonContent="Invite"
      />
      <UserTable
        data={data.users}
      />
      
  </div>;
}


function UserTable({
  data,
}: {
  data: DisplayUser[];
}) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  if (!data) {
    return <p>Loading...</p>;
  }

  // Calculate pagination
  const userQuery = trpc.user.useSuspenseQuery();
  const user = userQuery[0];

  return (
    <TableOuterFormatting>
      <Controls setSelectedFilter={setSelectedFilter} setSearchTerm={setSearchTerm} />
      <div className="flex flex-col">
        <TableHeaderFormatting>
          <p>First Name</p>
          <p>Last Name</p>
          <p>Email Address</p>
          <p>Role</p>
          <p>Status</p>
        </TableHeaderFormatting>

        {data
          .map((user: DisplayUser, key) => {
            return (
                <TableRowFormatting key={key} isLast={key === data.length - 1}>
                <p>{user.firstName}</p>
                <p>{user.lastName}</p>
                <p>
                  {user.email}
                </p>
                <p>
                  {user.role === Role.ADMIN ? "Admin" : user.role === Role.MODERATOR ? "P&R Rep" : user.role === Role.MUSICIAN ? "Musician" : "Media Maker"}
                </p>
                <p>
                    {user.firstName ? "Disabled" : "Active"}
                    </p>
              </TableRowFormatting>
            );
          })}
      </div>
    </TableOuterFormatting>
  );
}
