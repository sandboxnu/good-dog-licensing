"use client";

import { trpc } from "@good-dog/trpc/client";
import ProfileIcon from "../../../svg/ProfileIcon";
import ProfileDetails from "./ProfileDetails";
import { getRoleLabel } from "../../../../utils/enumLabelMapper";
import ArtistSubmissions from "./ArtistSubmissions";

export default function AristProfile({ userId }: { userId: string }) {
  const [user] = trpc.userById.useSuspenseQuery({ userId });

  const userRoleFormatted = getRoleLabel(user.role);
  const userCreatedAtFormatted = user.createdAt.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex w-[752px] flex-col gap-6">
      <div className="flex flex-row items-center gap-4">
        <ProfileIcon color="light" size={56} name={user.firstName} />
        <div className="flex flex-col">
          <header className="text-xl font-semibold text-green-400 dark:text-mint-200">
            {user.firstName + " " + user.lastName}
          </header>
          <div className="text-dark-gray-200 dark:text-dark-gray-100">
            {userRoleFormatted} | Since {userCreatedAtFormatted}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-[16px]">
        <ProfileDetails nonEditableUser={user} />
        <ArtistSubmissions user={user} />
      </div>
    </div>
  );
}
