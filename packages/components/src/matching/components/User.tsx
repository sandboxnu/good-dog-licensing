"use client";

import ProfileIcon from "../../svg/ProfileIcon";

export default function User({ name }: { name: string }) {
  return (
    <div className="flex flex-row w-fit border-[0.5px] border-cream-400 rounded-xl p-2 gap-2 bg-cream-100 shadow-md dark:bg-green-400 dark:border-black">
      <ProfileIcon color="light" size={20} name={name} />
      <p className="text-sm dark:text-gray-200">{name}</p>
    </div>
  );
}
