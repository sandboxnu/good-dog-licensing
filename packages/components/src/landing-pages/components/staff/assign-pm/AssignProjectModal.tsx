import { useState } from "react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@good-dog/ui/dialog";

import { AssignProjectSearchBar } from "./AssignProjectSearchBar";
import { StaffUserCard } from "./StaffUserCard";

type UserType = GetProcedureOutput<"adminAndModeratorUsers">["users"][number];

interface AssignProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (user: UserType) => void;
  assignedPM: UserType | null;
}

export function AssignProjectModal({
  open,
  onOpenChange,
  onAction,
  assignedPM: initialAssignedPM,
}: AssignProjectModalProps) {
  const [usersQuery] = trpc.adminAndModeratorUsers.useSuspenseQuery();

  const [searchedUsers, setSearchedUsers] = useState<UserType[]>(
    usersQuery.users,
  );
  const [assignedPM, setAssignedPM] = useState<UserType | null>(
    initialAssignedPM,
  );

  const handleDone = () => {
    if (assignedPM) {
      onAction(assignedPM);
    }
    setAssignedPM(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogContent
        className="flex h-[391px] w-[500px] flex-col rounded-2xl bg-white p-6"
        hideCloseButton
      >
        <div className="flex w-full flex-1 flex-col gap-4">
          <AssignProjectSearchBar setSearchedUsers={setSearchedUsers} />
          <div className="h-[250px] overflow-y-auto">
            {initialAssignedPM && (
              <>
                <div className="pt-[10px] text-body3 font-semibold">
                  Assigned
                </div>
                <StaffUserCard
                  key={initialAssignedPM.userId}
                  user={initialAssignedPM}
                  isAssigned={initialAssignedPM.userId === assignedPM?.userId}
                  onAssign={setAssignedPM}
                />
              </>
            )}
            <div className="pt-[10px] text-body3 font-semibold">Users</div>
            <div className="flex-1">
              {searchedUsers.length > 0 ? (
                <div className="flex flex-col">
                  {searchedUsers
                    .filter((user) => user.userId !== initialAssignedPM?.userId)
                    .map((user) => (
                      <StaffUserCard
                        key={user.userId}
                        user={user}
                        isAssigned={assignedPM?.userId === user.userId}
                        onAssign={setAssignedPM}
                      />
                    ))}
                </div>
              ) : (
                <p className="p-32 text-center">
                  Search for a project manager above!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-row justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outlined" className="px-6">
              Cancel
            </Button>
          </DialogClose>

          <Button className="px-6" onClick={handleDone} variant="contained">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
