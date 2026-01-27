"use client";

import { trpc } from "@good-dog/trpc/client";
import { useRouter } from "next/navigation";
import Button from "../../../base/Button";
import ErrorExclamation from "../../../svg/status-icons/ErrorExclamation";
import ProfileIcon from "../../../svg/ProfileIcon";
import { useEffect } from "react";
import { getRoleLabel } from "../../../../utils/enumLabelMapper";

function InfoField({ header, content }: { header: string; content: string }) {
  return (
    <div className="flex flex-col">
      <header className="text-dark-gray-200 bg-dark-gray-500">{header}</header>
      <div>{content}</div>
    </div>
  );
}

export default function ProfileWidget() {
  const router = useRouter();
  const { data: user } = trpc.user.useQuery();

  const userRoleFormatted = user
    ? getRoleLabel(user.role)
    : "Unknown";
  const userCreatedAtFormatted = user
    ? user.createdAt.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col gap-6 w-[752px]">
      <div className="flex flex-row items-center gap-4">
        <ProfileIcon color="light" size={56} editable={true} />
        <div className="flex flex-col">
          <header className="text-good-dog-main text-xl font-semibold">
            {user?.firstName + " " + user?.lastName}
          </header>
          <div className="text-dark-gray-200">
            {userRoleFormatted} | Since {userCreatedAtFormatted}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-[16px]">
        <div className="rounded-2xl bg-white border">
          <header className="flex justify-between items-center bg-gray-200 rounded-t-2xl pb-[12px] pt-[13px] px-[24px]">
            Personal details
            <Button
              size="small"
              variant="outlined"
              displayIcon="pencil"
              label="Edit"
            />
          </header>
          <div className="flex flex-col gap-y-[16px] rounded-2xl p-[24px] pt-[16px]">
            <div className="flex flex-row ">
              <div className="w-[380px]">
                <InfoField
                  header="First name"
                  content={user ? user.firstName : ""}
                />
              </div>
              <InfoField
                header="Last name"
                content={user ? user.lastName : ""}
              />
            </div>
            <div className="flex flex-row ">
              <div className="w-[380px]">
                <InfoField
                  header="Group"
                  content={user?.affiliation ? user.affiliation : "NONE"}
                />
              </div>
              <InfoField
                header="IPI No."
                content={user?.ipi ? user.ipi : "NONE"}
              />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white border">
          <header className="bg-gray-200 rounded-t-2xl pb-[12px] pt-[13px] px-[24px]">
            Security
          </header>
          <div className="flex flex-col gap-y-[16px] rounded-2xl p-[24px] pt-[16px]">
            <div className="flex flex-row justify-between items-center">
              <InfoField header="Email" content={user ? user.email : ""} />
              <Button label="Change email" size="small" variant="outlined" />
            </div>
            <div className="flex flex-row justify-between items-center">
              <InfoField header="Password" content="**********" />
              <Button label="Change password" size="small" variant="outlined" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border">
          <header className="rounded-t-2xl bg-white pb-[12px] pt-[13px] px-[23.5px] text-error">
            Delete account
          </header>
          <div className="flex flex-col gap-y-[16px] rounded-2xl p-[24px] pt-[16px]">
            <div className="flex flex-row justify-left items-center text-dark-gray-300">
              <ErrorExclamation size="medium" /> This will permanently delete
              your account and all your information. This action can't be
              undone!
            </div>
            <div>
              <Button
                label="Delete account"
                size="small"
                variant="outlined"
                error={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
