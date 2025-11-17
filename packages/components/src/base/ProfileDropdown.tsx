import Link from "next/link";

import { trpc } from "@good-dog/trpc/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@good-dog/ui/dropdown-menu";

import ProfileIcon from "../svg/ProfileIcon";

export default function ProfileDropdown() {
  const signOutMutation = trpc.signOut.useMutation({
    onSuccess: () => {
      window.location.replace("/");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ProfileIcon color="light" size={40} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="flex w-[138px] flex-col gap-2 border-light-green bg-white px-2 py-4"
      >
        <DropdownMenuItem className="h-[22px] text-base">
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="h-[22px] text-base">
          <button
            className="text-red-400 dark:text-red-300"
            onClick={() => signOutMutation.mutate()}
          >
            Log out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
