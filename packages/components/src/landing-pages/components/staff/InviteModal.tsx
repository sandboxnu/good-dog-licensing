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
} from "@good-dog/ui/dialog";
import { Button } from "@good-dog/ui/button";
import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { X } from "lucide-react";
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
    const trimmedEmail = currentEmail.trim();
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
      <DialogContent className="max-w-md rounded-2xl p-[24px] bg-white dark:bg-dark-gray-600 border border-1 border-cream-500">
        <DialogHeader className="flex flex-col text-left space-y-2 gap-[16px]">
          <DialogTitle className="pt-[24px] text-[35px] font-medium text-gray-500 dark:text-gray-200">
            Invite new PnR
          </DialogTitle>
          <div className="relative border-[0.5px] border-dark-gray-100 dark:border-dark-gray-300 focus-within:border-green-300 focus-within:dark:border-grass-green-100 rounded-md p-2 min-h-[40px] flex flex-wrap items-center gap-1 bg-white dark:bg-gray-800">
            {emails.map((email) => (
              <div
                key={email}
                className="inline-flex items-center bg-cream-100 dark:bg-green-600 text-dark-gray-500 dark:text-mint-100 px-2 py-1 rounded text-sm border-[0.5px] border-cream-400 dark:border-dark-gray-400 justify-between align-items gap-1"
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
              className="flex-1 outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-dark-gray-100 dark:placeholder-dark-gray-200"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <p className="font-medium text-dark-gray-500 dark:text-mint-300">
            People with access
          </p>
          {paginatedUsers.map((user) => (
            <div className="flex flex-row justify-between align-items">
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
