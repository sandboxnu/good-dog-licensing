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

      {isHovered && !isAssigned && (
        <Button
          size="small"
          label="Assign"
          variant="outlined"
          onClick={() => onAssign(user)}
        />
      )}

      {isAssigned && (
        <Button
          size="small"
          label="Assigned"
          variant="contained"
          onClick={() => onAssign(user)}
          disabled
        />
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
    <div className="flex items-center gap-3">
      <ProfileIcon size={40} color="light" name={user.firstName.charAt(0)} />
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-dark-gray-500 dark:text-gray-300">
            {user.firstName} {user.lastName}
          </span>
          {showRole && (
            <span className="text-sm text-dark-gray-100 dark:text-dark-gray-300">
              {getRoleLabel(user.role)}
            </span>
          )}
        </div>
        <span className="text-sm text-dark-gray-200 dark:text-dark-gray-100">
          {user.email}
        </span>
      </div>
    </div>
  );
}
