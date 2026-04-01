import { trpc } from "@good-dog/trpc/client";
import { useState } from "react";
import { StaffUserCardInfo } from "./assign-pm/StaffUserCard";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@good-dog/ui/dialog";
import { Button } from "@good-dog/ui/button";
import type { GetProcedureOutput } from "@good-dog/trpc/types";

type UserType = GetProcedureOutput<"allUsers">["users"][number];

export default function InviteModal({
  users,
  inviteModalOpen,
  setInviteModalOpen,
  children,
}: {
  users: UserType[];
  inviteModalOpen: boolean;
  setInviteModalOpen: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const sendModeratorInviteEmailMutation =
    trpc.sendModeratorInviteEmail.useMutation({
      onSuccess: () => {
        setInviteModalOpen(false);
      },
    });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmail = () => {
    if (
      currentEmail.trim() &&
      !emails.includes(currentEmail.trim()) &&
      validateEmail(currentEmail.trim())
    ) {
      setEmails([...emails, currentEmail.trim()]);
      setCurrentEmail("");
    }
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
    setInviteModalOpen(false);
  };

  return (
    <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
      {" "}
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogOverlay className="bg-gray-400 opacity-25" />{" "}
      <DialogContent className="max-w-md rounded-2xl p-[24px] bg-white dark:bg-dark-gray-600 border border-1 border-cream-500">
        <DialogHeader className="flex flex-col text-left space-y-2 gap-[16px]">
          <DialogTitle className="pt-[24px] text-[35px] font-medium text-gray-500 dark:text-gray-200">
            Invite new users
          </DialogTitle>
          <div className="relative border border-gray-300 dark:border-gray-600 rounded-md p-2 min-h-[40px] flex flex-wrap items-center gap-1 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500">
            {emails.map((email) => (
              <div
                key={email}
                className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm"
              >
                <span>{email}</span>
                <button
                  onClick={() => removeEmail(email)}
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  ×
                </button>
              </div>
            ))}
            <input
              type="email"
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={emails.length === 0 ? "Add email addresses..." : ""}
              className="flex-1 outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <p className="font-medium">People with access</p>
          {paginatedUsers.map((user) => (
            <StaffUserCardInfo key={user.userId} user={user} />
          ))}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="text"
              className="px-2 py-1"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
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

        <DialogFooter className="flex w-full gap-2 items-end">
          <Button
            variant="contained"
            className="px-4 py-1 ml-auto"
            onClick={onInvite}
          >
            Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
