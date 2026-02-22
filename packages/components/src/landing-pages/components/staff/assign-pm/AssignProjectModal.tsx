import { Button } from "@good-dog/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@good-dog/ui/dialog";
import { useEffect, useState } from "react";
import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { AssignProjectSearchBar } from "./AssignProjectSearchBar";
import { StaffUserCard } from "./StaffUserCard";
import { trpc } from "@good-dog/trpc/client";

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

  const [searchedUsers, setSearchedUsers] = useState<UserType[]>([]);
  const [assignedPM, setAssignedPM] = useState<UserType | null>(
    initialAssignedPM,
  );

  useEffect(() => {
    if (open) {
      setAssignedPM(initialAssignedPM);
    }
  }, [initialAssignedPM, open]);

  useEffect(() => {
    if (open) {
      setSearchedUsers(usersQuery.users);
    }
  }, [open, usersQuery]);

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
        className="w-[500px] h-[391px] rounded-2xl p-6 bg-white flex flex-col"
        hideCloseButton
      >
        <div className="flex flex-col gap-4 w-full flex-1">
          <AssignProjectSearchBar setSearchedUsers={setSearchedUsers} />
          <div className="h-[250px] overflow-y-auto">
            {initialAssignedPM && (
              <>
                <div className="text-body3 font-semibold pt-[10px]">
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
            <div className="text-body3 font-semibold pt-[10px]">Users</div>
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
                <p className="text-center p-32">
                  Search for a project manager above!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-2 justify-end mt-4">
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
