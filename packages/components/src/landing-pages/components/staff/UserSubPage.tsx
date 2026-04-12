import { useState } from "react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { Role } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";

import { Switch } from "../../../base/Switch";
import UserAdd from "../../../svg/UserAdd";
import Header from "../Header";
import InviteModal from "./InviteModal";
import {
  TableEmptyMessage,
  TableHeaderFormatting,
  TableOuterFormatting,
  TableRowFormatting,
} from "./TableFormatting";

type UserType = GetProcedureOutput<"allUsers">["users"][number];

/**
 * User sub-page of admin dashboard.
 */
export default function UserSubPage() {
  const [data] = trpc.allUsers.useSuspenseQuery();
  const [inviteModalOpen, setInviteModalOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-[32px]">
      <div className="flex flex-row items-center">
        <Header title={"Users"} subtitle={"All users on the platform"} />
        <Button
          variant={"contained"}
          size={"medium-text"}
          onClick={() => setInviteModalOpen(true)}
        >
          <div className="flex flex-row items-center justify-center gap-2">
            <UserAdd />
            Invite
          </div>
        </Button>
      </div>
      <InviteModal
        users={data.users}
        inviteModalOpen={inviteModalOpen}
        setInviteModalOpen={setInviteModalOpen}
      />

      <UserTable data={data.users} />
    </div>
  );
}

function UserTable({ data }: { data: UserType[] }) {
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

        {data.map((user: UserType, key) => {
          return (
            <TableRowFormatting
              key={key}
              isLast={key === data.length - 1}
              columnCount={5}
            >
              <p className="truncate dark:text-white">{user.firstName}</p>
              <p className="truncate dark:text-white">{user.lastName}</p>
              <p className="truncate dark:text-white">{user.email}</p>
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
