import { useState } from "react";
import { X } from "lucide-react";

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
import { StaffUserCardInfo } from "./assign-pm/StaffUserCard";

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
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const sendModeratorInviteEmailMutation =
    trpc.sendModeratorInviteEmail.useMutation({
      onSuccess: () => {
        closeModal();
      },
    });

  const closeModal = () => {
    setEmails([]);
    setCurrentEmail("");
    setError("");
    setInviteModalOpen(false);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmail = () => {
    const trimmedEmail = currentEmail.trim().toLowerCase();
    if (!trimmedEmail) return;

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (emails.includes(trimmedEmail)) {
      setError("This email has already been added");
      return;
    }

    // Check if email is already in users list
    if (users.some((user) => user.email === trimmedEmail)) {
      setError("This user already has access");
      return;
    }

    setEmails([...emails, trimmedEmail]);
    setCurrentEmail("");
    setError("");
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail();
    }
  };

  const onInvite = () => {
    emails.forEach((email) => {
      sendModeratorInviteEmailMutation.mutate({ moderatorEmail: email });
    });
    closeModal();
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
          <div className="relative flex min-h-[40px] flex-wrap items-center gap-1 rounded-md border-[0.5px] border-dark-gray-100 bg-white p-2 focus-within:border-green-300 dark:border-dark-gray-300 dark:bg-dark-gray-500 focus-within:dark:border-grass-green-100">
            {emails.map((email) => (
              <div
                key={email}
                className="align-items inline-flex items-center justify-between gap-1 rounded border-[0.5px] border-cream-400 bg-cream-100 px-2 py-1 text-sm text-dark-gray-500 dark:border-dark-gray-400 dark:bg-green-600 dark:text-mint-100"
              >
                <span>{email}</span>
                <button
                  onClick={() => removeEmail(email)}
                  className="h-[16px] w-[16px]"
                >
                  <X
                    size={"sm"}
                    className="text-green-400 dark:text-mint-300"
                  />
                </button>
              </div>
            ))}
            <input
              type="email"
              value={currentEmail}
              onChange={(e) => {
                setCurrentEmail(e.target.value);
                if (error) setError(""); // Clear error when user starts typing
              }}
              onKeyDown={handleKeyDown}
              placeholder={emails.length === 0 ? "example@email.com" : ""}
              className="text-gray-900 flex-1 border-none bg-transparent placeholder-gray-500 outline-none dark:bg-dark-gray-500 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          <p className="font-medium text-dark-gray-500 dark:text-mint-300">
            People with access
          </p>
          {paginatedUsers.map((user) => (
            <div
              className="align-items flex flex-row justify-between"
              key={user.userId}
            >
              <StaffUserCardInfo
                key={user.userId}
                user={user}
                showRole={false}
              />
              <span className="text-sm text-dark-gray-100 dark:text-dark-gray-300">
                {getRoleLabel(user.role)}
              </span>
            </div>
          ))}
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="text"
              className="px-2 py-1"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm dark:text-dark-gray-100">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="text"
              className="px-2 py-1"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </DialogHeader>

        <DialogFooter className="flex w-full items-end gap-2">
          <Button
            variant="contained"
            className="ml-auto px-4 py-1"
            onClick={onInvite}
          >
            Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
