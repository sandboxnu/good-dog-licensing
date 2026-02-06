"use client";

import ProfileIcon from "../../svg/ProfileIcon";

export default function User({ name }: { name: string }) {
  return (
    <div className="flex flex-row w-fit border-[0.5px] border-cream-400 rounded-xl p-2 gap-2 bg-cream-100 shadow-md">
      <ProfileIcon color="light" size={20} editable={false} name={name} />
      <p className="text-sm">{name}</p>
    </div>
  );
}
