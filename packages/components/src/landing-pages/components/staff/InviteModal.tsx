import { useState } from "react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@good-dog/ui/dialog";

import { getRoleLabel } from "../../../../utils/enumLabelMapper";

type UserType = GetProcedureOutput<"allUsers">["users"][number];

export default function InviteModal({
  users,
  inviteModalOpen,
  setInviteModalOpen,
}: {
  users: UserType[];
  inviteModalOpen: boolean;
  setInviteModalOpen: (open: boolean) => void;
}) {
  const [email, setEmail] = useState<string>("");

  const sendModeratorInviteEmailMutation =
    trpc.sendModeratorInviteEmail.useMutation({
      onSuccess: () => {
        closeModal();
      },
    });

  const closeModal = () => {
    setEmail("");
    setInviteModalOpen(false);
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const trimmedEmail = email.trim().toLowerCase();
  const isValidEmail = validateEmail(trimmedEmail);

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === trimmedEmail,
  );

  const canSendInvite =
    isValidEmail &&
    !existingUser &&
    !sendModeratorInviteEmailMutation.isPending;

  const onInvite = () => {
    if (!canSendInvite) return;
    sendModeratorInviteEmailMutation.mutate({ moderatorEmail: trimmedEmail });
  };

  return (
    <Dialog open={inviteModalOpen} onOpenChange={closeModal}>
      {" "}
      <DialogOverlay className="bg-gray-400 opacity-25" />{" "}
      <DialogContent className="border-1 max-w-md rounded-2xl border border-cream-500 bg-white p-[24px] dark:border-grass-green-100 dark:bg-dark-gray-600">
        <DialogHeader className="flex flex-col gap-[16px] space-y-2 text-left">
          <DialogTitle className="pt-[24px] text-[35px] font-medium text-gray-500 dark:text-gray-200">
            Invite new PnR
          </DialogTitle>
          <p className="text-dark-gray-500 dark:text-mint-300">
            Enter the email address of the person you would like to invite.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="text-gray-900 min-h-[40px] rounded-md border-[0.5px] border-dark-gray-100 bg-white p-2 placeholder-gray-500 outline-none focus:border-green-300 dark:border-dark-gray-300 dark:bg-dark-gray-500 dark:text-gray-100 dark:placeholder-gray-400 focus:dark:border-grass-green-100"
          />
          {existingUser && (
            <p className="mt-1 text-sm text-red-500">
              This user already exists as a &quot;
              {getRoleLabel(existingUser.role)}&quot;
            </p>
          )}
        </DialogHeader>

        <DialogFooter className="flex w-full items-end gap-2">
          <Button
            variant="contained"
            className="ml-auto px-4 py-1"
            onClick={onInvite}
            disabled={!canSendInvite}
          >
            Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
