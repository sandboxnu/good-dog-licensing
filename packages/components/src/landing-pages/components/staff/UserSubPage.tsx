import { useState } from "react";
import { UserPlus } from "lucide-react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { Role } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";

import Pagination, { usePagination } from "../../../base/Pagination";
import { Switch } from "../../../base/Switch";
import Header from "../Header";
import InviteModal from "./InviteModal";
import SortableTableColumnHeader from "./SortableTableColumnHeader";
import {
  MobileCard,
  MobileCardList,
  MobileSortSelect,
  TABLE_DESKTOP_ONLY_CLASS,
  TableEmptyMessage,
  TableHeaderFormatting,
  TableOuterFormatting,
  TableRowFormatting,
} from "./TableFormatting";

type UserType = GetProcedureOutput<"allUsers">["users"][number];

type SortColumn = "firstName" | "lastName" | "email" | "role" | "status";

const PAGE_SIZE = 10;

const SORT_OPTIONS: { value: SortColumn; label: string }[] = [
  { value: "role", label: "Role" },
  { value: "firstName", label: "First name" },
  { value: "lastName", label: "Last name" },
  { value: "email", label: "Email" },
  { value: "status", label: "Status" },
];

const getRoleDisplay = (role: Role) =>
  role === Role.ADMIN
    ? "Admin"
    : role === Role.MODERATOR
      ? "P&R Rep"
      : role === Role.MUSICIAN
        ? "Musician"
        : "Media Maker";

const sortUsers = (users: UserType[], sortColumn: SortColumn) => {
  return users.sort((a, b) => {
    switch (sortColumn) {
      case "firstName":
        return a.firstName
          .toLocaleLowerCase()
          .localeCompare(b.firstName.toLocaleLowerCase());
      case "lastName":
        return a.lastName
          .toLocaleLowerCase()
          .localeCompare(b.lastName.toLocaleLowerCase());
      case "email":
        return a.email
          .toLocaleLowerCase()
          .localeCompare(b.email.toLocaleLowerCase());
      case "role":
        return a.role.localeCompare(b.role);
      case "status":
        return a.active === b.active ? 0 : a.active ? -1 : 1;
    }
  });
};

/**
 * User sub-page of admin dashboard.
 */
export default function UserSubPage() {
  const [data] = trpc.allUsers.useSuspenseQuery();
  const [inviteModalOpen, setInviteModalOpen] = useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState<SortColumn>("role");

  const { pageItems, paginationProps } = usePagination(
    sortUsers(data.users, sortColumn),
    PAGE_SIZE,
    sortColumn,
  );

  return (
    <div className="flex flex-col gap-[32px]">
      <div className="flex flex-row items-start gap-3 md:items-center">
        <Header title={"Users"} subtitle={"All users on the platform"} />
        <Button
          variant={"contained"}
          size={"medium-text"}
          onClick={() => setInviteModalOpen(true)}
        >
          <div className="flex flex-row items-center justify-center gap-2">
            <UserPlus className="h-5 w-5 text-mint-100 dark:text-mint-300" />
            Invite
          </div>
        </Button>
      </div>
      <InviteModal
        users={data.users}
        inviteModalOpen={inviteModalOpen}
        setInviteModalOpen={setInviteModalOpen}
      />

      <UserTable
        data={pageItems}
        sortColumn={sortColumn}
        setSortColumn={setSortColumn}
        paginationProps={paginationProps}
      />
    </div>
  );
}

function UserTable({
  data,
  sortColumn,
  setSortColumn,
  paginationProps,
}: {
  data: UserType[];
  sortColumn: SortColumn;
  setSortColumn: (newSort: SortColumn) => void;
  paginationProps: React.ComponentProps<typeof Pagination>;
}) {
  return (
    <TableOuterFormatting>
      <MobileSortSelect
        id="usersSort"
        value={sortColumn}
        options={SORT_OPTIONS}
        onChange={setSortColumn}
      />
      <MobileCardList>
        {data.map((user) => (
          <MobileCard key={user.userId}>
            <div className="flex flex-row items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-1">
                <p className="truncate text-body1 font-semibold text-dark-gray-500 dark:text-mint-300">
                  {user.firstName + " " + user.lastName}
                </p>
                <p className="text-body3 wrap-anywhere text-dark-gray-300 dark:text-gray-200">
                  {user.email}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-gray-300 px-2 py-0.5 text-caption text-gray-500 dark:bg-gray-500 dark:text-gray-200">
                {getRoleDisplay(user.role)}
              </span>
            </div>
            <div className="flex flex-row items-center justify-between text-body3 text-dark-gray-500 dark:text-gray-200">
              <span>Active</span>
              <ActivationSwitch userId={user.userId} active={user.active} />
            </div>
          </MobileCard>
        ))}
        {data.length == 0 && <TableEmptyMessage />}
      </MobileCardList>

      <div className={`flex flex-col ${TABLE_DESKTOP_ONLY_CLASS}`}>
        <TableHeaderFormatting columnCount={5}>
          <SortableTableColumnHeader
            columnName="First Name"
            currentSort={sortColumn}
            sortColumn="firstName"
            setSortColumn={setSortColumn}
          />
          <SortableTableColumnHeader
            columnName="Last Name"
            currentSort={sortColumn}
            sortColumn="lastName"
            setSortColumn={setSortColumn}
          />
          <SortableTableColumnHeader
            columnName="Email Address"
            currentSort={sortColumn}
            sortColumn="email"
            setSortColumn={setSortColumn}
          />
          <SortableTableColumnHeader
            columnName="Role"
            currentSort={sortColumn}
            sortColumn="role"
            setSortColumn={setSortColumn}
          />
          <SortableTableColumnHeader
            columnName="Status"
            currentSort={sortColumn}
            sortColumn="status"
            setSortColumn={setSortColumn}
          />
        </TableHeaderFormatting>

        {data.map((user: UserType, key) => {
          return (
            <TableRowFormatting
              key={user.userId}
              isLast={key === data.length - 1}
              columnCount={5}
            >
              <p className="truncate dark:text-white">{user.firstName}</p>
              <p className="truncate dark:text-white">{user.lastName}</p>
              <p className="truncate dark:text-white">{user.email}</p>
              <p className="dark:text-white">{getRoleDisplay(user.role)}</p>
              <ActivationSwitch userId={user.userId} active={user.active} />
            </TableRowFormatting>
          );
        })}
        {data.length == 0 && <TableEmptyMessage />}
      </div>
      <Pagination {...paginationProps} />
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
