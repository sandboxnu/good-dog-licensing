"use client";

import { useRouter } from "next/navigation";
import ProfileIcon from "../../svg/ProfileIcon";

export default function User({ name, id }: { name: string; id: string }) {
  const router = useRouter();

  return (
    <button
      className="flex w-fit flex-row gap-2 rounded-xl border-[0.5px] border-cream-400 bg-cream-100 p-2 shadow-md dark:border-black dark:bg-green-400"
      onClick={() => router.push(`/user/${id}`)}
    >
      <ProfileIcon color="light" size={20} name={name} />
      <p className="text-sm text-dark-gray-500 dark:text-gray-300">{name}</p>
    </button>
  );
}
