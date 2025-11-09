import { trpc } from "@good-dog/trpc/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@good-dog/ui/dropdown-menu";
import Link from "next/link";
import ProfileIcon from "../svg/ProfileIcon";

interface ProfileDropdownProps {
  label?: string;
}

export default function ProfileDropdown({}: ProfileDropdownProps) {
  const signOutMutation = trpc.signOut.useMutation({
    onSuccess: () => {
      window.location.replace("/");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ProfileIcon color="light" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[138px] gap-2 py-4 px-2 bg-white border-light-green flex flex-col gap-2">
        <DropdownMenuItem className="text-base h-[22px]">
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-base h-[22px]">
          <button
            className="text-error"
            onClick={() => signOutMutation.mutate()}
          >
            Log out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
