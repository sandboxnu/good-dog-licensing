"use client";

import ProfileIcon from "../../svg/ProfileIcon";

export default function User({ name }: { name: string }) {
  return (
    <div className="flex flex-row w-fit border-[0.5px] border-[#ECE6DF] rounded-xl p-2 gap-2 bg-cream-100 shadow-md dark:bg-green-600">
      <ProfileIcon color="light" size={20} name={name} />
      <p className="text-sm text-dark-gray-500 dark:text-gray-300">{name}</p>
    </div>
  );
}
