import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { useState } from "react";
import ProfileIcon from "../../../../svg/ProfileIcon";
import Button from "../../../../base/Button";
import { getRoleLabel } from "../../../../../utils/enumLabelMapper";

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
      <div className="flex items-center gap-3">
        <ProfileIcon size={40} color="light" name={user.firstName.charAt(0)} />
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-sm text-gray-600">
              {getRoleLabel(user.role)}
            </span>
          </div>
          <span className="text-sm text-gray-500">{user.email}</span>
        </div>
      </div>

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
