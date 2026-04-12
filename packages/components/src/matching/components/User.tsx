"use client";

import { useRouter } from "next/navigation";
import ProfileIcon from "../../svg/ProfileIcon";
import { trpc } from "@good-dog/trpc/client";
import { Role } from "@good-dog/db";

export default function User({
  name,
  id,
  role,
}: {
  name: string;
  id: string;
  role: Role;
}) {
  const router = useRouter();
  const [currentUser] = trpc.user.useSuspenseQuery();

  const isArtist =
    currentUser?.role === "MEDIA_MAKER" || currentUser?.role === "MUSICIAN";
  // wanted to avoid passing in role to avoid component complexity, but otherwise I would need to trpc.userById and that seems like a lot of queries
  const targetIsStaff = role === "ADMIN" || role === "MODERATOR";
  const disabled = isArtist && targetIsStaff;

  return (
    <button
      className={`flex w-fit flex-row gap-2 rounded-xl border-[0.5px] border-cream-400 bg-cream-100 p-2 shadow-md dark:border-black dark:bg-green-400 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      onClick={() => !disabled && router.push(`/user/${id}`)}
      disabled={disabled}
    >
      <ProfileIcon color="light" size={20} name={name} />
      <p className="text-sm text-dark-gray-500 dark:text-gray-300">{name}</p>
    </button>
  );
}
