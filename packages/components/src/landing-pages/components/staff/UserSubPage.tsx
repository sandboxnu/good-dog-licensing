import { trpc } from "@good-dog/trpc/client";
import Header from "../Header";
import {
  TableEmptyMessage,
  TableHeaderFormatting,
  TableOuterFormatting,
  TableRowFormatting,
} from "./TableFormatting";
import { Role } from "@good-dog/db";
import type { User } from "@prisma/client";
import { useState } from "react";
import { Switch } from "../../../base/Switch";
type DisplayUser = Omit<User, "hashedPassword">;
/**
 * User sub-page of admin dashboard.
 */
export default function UserSubPage() {
  const [data] = trpc.allUsers.useSuspenseQuery();
  return (
    <div className="flex flex-col gap-[32px]">
      <Header
        title={"Users"}
        subtitle={"All users on the platform"}
        requestPath={""}
        buttonContent="Invite"
      />
      <UserTable data={data.users} />
    </div>
  );
}

function UserTable({ data }: { data: DisplayUser[] }) {
  return (
    <TableOuterFormatting>
      <div className="flex flex-col">
        <TableHeaderFormatting columnCount={5}>
          <p className="dark:text-white">First Name</p>
          <p className="dark:text-white">Last Name</p>
          <p className="dark:text-white">Email Address</p>
          <p className="dark:text-white">Role</p>
          <p className="dark:text-white">Status</p>
        </TableHeaderFormatting>

        {data.map((user: DisplayUser, key) => {
          return (
            <TableRowFormatting
              key={key}
              isLast={key === data.length - 1}
              columnCount={5}
            >
              <p className="dark:text-white truncate">{user.firstName}</p>
              <p className="dark:text-white truncate">{user.lastName}</p>
              <p className="dark:text-white truncate">{user.email}</p>
              <p className="dark:text-white">
                {user.role === Role.ADMIN
                  ? "Admin"
                  : user.role === Role.MODERATOR
                    ? "P&R Rep"
                    : user.role === Role.MUSICIAN
                      ? "Musician"
                      : "Media Maker"}
              </p>
              <ActivationSwitch userId={user.userId} active={user.active} />
            </TableRowFormatting>
          );
        })}
        {data.length == 0 && <TableEmptyMessage />}
      </div>
    </TableOuterFormatting>
  );
}

function ActivationSwitch({
  userId,
  active,
}: {
  userId: string;
  active: boolean;
}) {
  const [isActive, setIsActive] = useState<boolean>(active);

  const handleStatusChange = (checked: boolean) => {
    if (checked) {
      activateUserMutation.mutate({ userId: userId });
    } else {
      deactivateUserMutation.mutate({ userId: userId });
    }
  };

  const activateUserMutation = trpc.activateUser.useMutation({
    onSuccess: () => {
      setIsActive(true);
    },
  });

  const deactivateUserMutation = trpc.deactivateUser.useMutation({
    onSuccess: () => {
      setIsActive(false);
    },
  });
  return <Switch checked={isActive} onCheckedChange={handleStatusChange} />;
}
