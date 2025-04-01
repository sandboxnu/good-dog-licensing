"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import InviteModeratorModal from "./InviteModeratorModal";

interface AdminDashboardProps {
  page: "songs" | "projects" | "users";
  userRole: "ADMIN" | "MODERATOR";
  userFirstName: string;
  userLastName: string;
}

export default function NewAdminDashboard({
  page,
  userRole,
  userFirstName,
  userLastName,
}: AdminDashboardProps) {
  const router = useRouter();
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);

  return (
    <div className="h-screen w-full bg-[#DEE0E2] p-[60px]">
      <div className="flex rounded-xl bg-[#F6F8FA]">
        <div className="w-1/5">
          <div className="flex pl-[60px] pt-[53px]">
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="39"
                height="45"
                viewBox="0 0 29 32"
                fill="none"
              >
                <path
                  d="M20.7137 19.0596C22.7667 19.0598 24.7404 19.8499 26.2232 21.2652C27.706 22.6806 28.5835 24.6119 28.6726 26.6565L28.6806 27.0011V28.5894C28.6808 29.3909 28.3772 30.1628 27.8305 30.7504C27.2838 31.3381 26.5345 31.698 25.7328 31.7581L25.4938 31.7661H3.18673C2.38275 31.7663 1.60839 31.4636 1.01888 30.9187C0.429365 30.3738 0.068265 29.6269 0.007967 28.8277L0 28.5894V27.0011C0.000118614 24.9547 0.792765 22.9873 2.21264 21.5092C3.63252 20.0311 5.57 19.1564 7.62106 19.0676L7.96682 19.0596H20.7137ZM14.3403 0C16.4532 0 18.4796 0.836693 19.9737 2.32602C21.4677 3.81534 22.3071 5.83529 22.3071 7.94151C22.3071 10.0477 21.4677 12.0677 19.9737 13.557C18.4796 15.0463 16.4532 15.883 14.3403 15.883C12.2273 15.883 10.201 15.0463 8.70688 13.557C7.21282 12.0677 6.37346 10.0477 6.37346 7.94151C6.37346 5.83529 7.21282 3.81534 8.70688 2.32602C10.201 0.836693 12.2273 0 14.3403 0Z"
                  fill="#5F5F5F"
                />
              </svg>
            </div>
            <div className="flex-col items-center justify-center pl-[8px]">
              <div className="font-afacad text-xl font-semibold text-black">
                {userFirstName + " " + userLastName}
              </div>
              <div className="font-afacad text-base font-normal text-[#7D7C7C]">
                {userRole}
              </div>
            </div>
          </div>
          <div className="pl-[50px] pr-[40px] pt-[43px]">
            <button
              onClick={() => router.push("/dashboard/songs")}
              className={clsx(
                "flex h-[50px] w-[300px] items-center rounded-xl pl-[10px]",
                {
                  "bg-[#F6F8FA]": page !== "songs",
                  "bg-[#D7D8D9]": page === "songs",
                },
              )}
            >
              <Image
                src="/icons/music.svg"
                width={24}
                height={24}
                alt="music-icon"
                className=""
              />
              <div className="font-afacad pl-[10px] text-lg font-normal text-black">
                Songs
              </div>
            </button>
          </div>
          <div className="pl-[50px] pr-[40px] pt-[8px]">
            <button
              onClick={() => router.push("/dashboard/projects")}
              className={clsx(
                "flex h-[50px] w-[300px] items-center rounded-xl pl-[10px]",
                {
                  "bg-[#F6F8FA]": page !== "projects",
                  "bg-[#D7D8D9]": page === "projects",
                },
              )}
            >
              <Image
                src="/icons/play-circle.svg"
                width={24}
                height={24}
                alt="play-circle-icon"
                className=""
              />
              <div className="font-afacad pl-[10px] text-lg font-normal text-black">
                Projects
              </div>
            </button>
          </div>
          <div className="pl-[50px] pr-[40px] pt-[8px]">
            <button
              onClick={() => router.push("/dashboard/users")}
              className={clsx(
                "flex h-[50px] w-[300px] items-center rounded-xl pl-[10px]",
                {
                  "bg-[#F6F8FA]": page !== "users",
                  "bg-[#D7D8D9]": page === "users",
                },
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M16.0253 20.5713L16.0256 17.3576C16.0258 15.5824 14.5867 14.1432 12.8115 14.1432H5.61432C3.83939 14.1432 2.40046 15.582 2.40026 17.3569L2.3999 20.5713M21.5996 20.5715L21.5999 17.3577C21.6001 15.5825 20.161 14.1434 18.3858 14.1434M15.4062 4.06109C16.1955 4.64673 16.7071 5.58559 16.7071 6.64392C16.7071 7.70225 16.1955 8.6411 15.4062 9.22674M12.4937 6.64374C12.4937 8.41882 11.0547 9.8578 9.27964 9.8578C7.50457 9.8578 6.06559 8.41882 6.06559 6.64374C6.06559 4.86867 7.50457 3.42969 9.27964 3.42969C11.0547 3.42969 12.4937 4.86867 12.4937 6.64374Z"
                  stroke="#A3A3A3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="font-afacad pl-[10px] text-lg font-normal text-black">
                Users
              </div>
            </button>
          </div>
        </div>
        <div className="w-4/5 px-[36px] pt-[40px]">
          <div className="flex rounded-xl bg-white px-[38px] pt-[30px]">
            <div className="font-afacad w-1/2 text-3xl font-semibold text-black">
              Users
            </div>
            {userRole === "ADMIN" && (
              <div className="right flex w-1/2 justify-end">
                <button
                  onClick={() => {
                    setShowInviteModal(true);
                  }}
                  className="flex h-[41px] w-[110px] items-center space-x-2 rounded-xl border border-[rgba(163,163,163,0.51)] bg-white pl-[14px]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="24"
                    viewBox="0 0 23 24"
                    fill="none"
                  >
                    <path
                      d="M1.71387 21.6003C1.71381 22.1526 2.16148 22.6003 2.71377 22.6004C3.26605 22.6004 3.71381 22.1528 3.71387 21.6005L1.71387 21.6003ZM2.71423 18L3.71423 18.0001L2.71423 18ZM11.9255 15.4004C12.4777 15.4004 12.9255 14.9527 12.9255 14.4004C12.9255 13.8481 12.4777 13.4004 11.9255 13.4004V15.4004ZM20.0533 16.6004C20.6056 16.6004 21.0533 16.1527 21.0533 15.6004C21.0533 15.0481 20.6056 14.6004 20.0533 14.6004V16.6004ZM15.1766 14.6004C14.6243 14.6004 14.1766 15.0481 14.1766 15.6004C14.1766 16.1527 14.6243 16.6004 15.1766 16.6004V14.6004ZM16.615 18.3002C16.615 18.8525 17.0627 19.3002 17.615 19.3002C18.1673 19.3002 18.615 18.8525 18.615 18.3002H16.615ZM18.615 12.9002C18.615 12.348 18.1673 11.9002 17.615 11.9002C17.0627 11.9002 16.615 12.348 16.615 12.9002H18.615ZM12.551 6.00039C12.551 7.53466 11.4497 8.60039 10.2999 8.60039V10.6004C12.7412 10.6004 14.551 8.44257 14.551 6.00039H12.551ZM10.2999 8.60039C9.15005 8.60039 8.04873 7.53466 8.04873 6.00039H6.04873C6.04873 8.44257 7.85859 10.6004 10.2999 10.6004V8.60039ZM8.04873 6.00039C8.04873 4.46612 9.15005 3.40039 10.2999 3.40039V1.40039C7.85859 1.40039 6.04873 3.55821 6.04873 6.00039H8.04873ZM10.2999 3.40039C11.4497 3.40039 12.551 4.46612 12.551 6.00039H14.551C14.551 3.55821 12.7412 1.40039 10.2999 1.40039V3.40039ZM3.71387 21.6005L3.71423 18.0001L1.71423 17.9999L1.71387 21.6003L3.71387 21.6005ZM5.96538 13.4004C3.52428 13.4004 1.71448 15.5579 1.71423 17.9999L3.71423 18.0001C3.71439 16.466 4.81564 15.4004 5.96538 15.4004V13.4004ZM5.96538 15.4004H11.9255V13.4004H5.96538V15.4004ZM20.0533 14.6004H17.615V16.6004H20.0533V14.6004ZM17.615 14.6004H15.1766V16.6004H17.615V14.6004ZM18.615 18.3002V15.6004H16.615V18.3002H18.615ZM18.615 15.6004V12.9002H16.615V15.6004H18.615Z"
                      fill="#222124"
                    />
                  </svg>
                  <p className="font-afacad text-base font-normal text-black">
                    Invite
                  </p>
                </button>
              </div>
            )}
            {showInviteModal && (
              <InviteModeratorModal
                handleFinished={() => {
                  setShowInviteModal(false);
                }}
                xPos={150}
                yPos={180}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
