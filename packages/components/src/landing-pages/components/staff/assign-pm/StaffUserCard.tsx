import { useState } from "react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";

import { getRoleLabel } from "../../../../../utils/enumLabelMapper";
import Button from "../../../../base/Button";
import ProfileIcon from "../../../../svg/ProfileIcon";

type UserType = GetProcedureOutput<"adminAndModeratorUsers">["users"][number];

interface StaffUserCardProps {
  user: UserType;
  isAssigned: boolean;
  onAssign: (user: UserType) => void;
}

export function StaffUserCard({
  user,
  isAssigned,
  onAssign,
}: StaffUserCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center justify-between gap-4 rounded-lg bg-white p-4 hover:bg-gray-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StaffUserCardInfo user={user} />

      {/* Desktop shows "Assign" on hover; touch screens have no hover, so
          it's always visible on phones */}
      {!isAssigned && (
        <div className={`shrink-0 ${isHovered ? "" : "md:hidden"}`}>
          <Button
            size="small"
            label="Assign"
            variant="outlined"
            onClick={() => onAssign(user)}
          />
        </div>
      )}

      {isAssigned && (
        <div className="shrink-0">
          <Button
            size="small"
            label="Assigned"
            variant="contained"
            onClick={() => onAssign(user)}
            disabled
          />
        </div>
      )}
    </div>
  );
}

export function StaffUserCardInfo({
  user,
  showRole = true,
}: {
  user: UserType;
  showRole?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <ProfileIcon size={40} color="light" name={user.firstName.charAt(0)} />
      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold text-dark-gray-500 dark:text-gray-300">
            {user.firstName} {user.lastName}
          </span>
          {showRole && (
            <span className="text-sm text-dark-gray-100 dark:text-dark-gray-300">
              {getRoleLabel(user.role)}
            </span>
          )}
        </div>
        <span className="truncate text-sm text-dark-gray-200 dark:text-dark-gray-100">
          {user.email}
        </span>
      </div>
    </div>
  );
}
