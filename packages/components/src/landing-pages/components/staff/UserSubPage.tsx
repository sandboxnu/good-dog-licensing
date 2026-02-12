import { trpc } from "@good-dog/trpc/client";
import Header from "../Header";
import { TableHeaderFormatting, TableOuterFormatting, TableRowFormatting } from "./TableFormatting";
import { Role } from "@good-dog/db";
import type {
  User,
} from "@prisma/client";
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

  return (
    <TableOuterFormatting>
      <div className="flex flex-col">
        <TableHeaderFormatting columnCount={5}>
          <p>First Name</p>
          <p>Last Name</p>
          <p>Email Address</p>
          <p>Role</p>
          <p>Status</p>
        </TableHeaderFormatting>

        {data
          .map((user: DisplayUser, key) => {
            return (
                <TableRowFormatting key={key} isLast={key === data.length - 1} columnCount={5}>
                <p className="truncate">{user.firstName}</p>
                <p className="truncate">{user.lastName}</p>
                <p className="truncate">
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
