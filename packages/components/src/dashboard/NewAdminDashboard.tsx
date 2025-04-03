"use client";

import React, { useState } from "react";

import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";

import DashboardSideBarComponent from "./DashboardSideBarComponent";
import DisplayProjects from "./DisplayProjects";
import InviteModeratorModal from "./InviteModeratorModal";

interface AdminDashboardProps {
  page: "songs" | "projects" | "users";
}

export default function NewAdminDashboard({ page }: AdminDashboardProps) {
  const userQuery = trpc.user.useSuspenseQuery();
  const user = userQuery[0];
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);

  return (
    <div className="h-screen w-full bg-[#DEE0E2] p-[60px]">
      <div className="flex h-full w-full rounded-xl bg-[#F6F8FA]">
        <div className="w-[325px]">
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
                {user?.firstName + " " + user?.lastName}
              </div>
              <div className="font-afacad text-base font-normal text-[#7D7C7C]">
                {user?.role === "MODERATOR" ? "P&R Rep" : "Admin"}
              </div>
            </div>
          </div>
          <div className="pl-[50px] pr-[40px] pt-[43px]">
            <DashboardSideBarComponent name="Songs" curPage={page} />
          </div>
          <div className="pl-[50px] pr-[40px] pt-[8px]">
            <DashboardSideBarComponent name="Projects" curPage={page} />
          </div>
          <div className="pl-[50px] pr-[40px] pt-[8px]">
            <DashboardSideBarComponent name="Users" curPage={page} />
          </div>
        </div>
        <div className="w-full px-[36px] py-[40px]">
          <div className="h-full rounded-xl bg-white px-[38px] pt-[30px]">
            <div className="flex">
              <div className="w-1/2">
                <div className="font-afacad text-3xl font-semibold text-black">
                  {page === "projects"
                    ? "Projects"
                    : page === "songs"
                      ? "Songs"
                      : "Users"}
                </div>
                <div className="font-afacad pt-[12px] text-xl font-medium text-[#A3A3A3]">
                  {page === "projects"
                    ? "Here you'll find all the current projects"
                    : page === "songs"
                      ? "Here you'll find all the current songs"
                      : "Here you'll find all the active users"}
                </div>
              </div>
              {user?.role === "ADMIN" && (
                <div className="right flex w-1/2 justify-end">
                  <Button
                    onClick={() => {
                      setShowInviteModal(true);
                    }}
                    className="flex h-[41px] w-[110px] items-center space-x-2 rounded-xl border border-[rgba(163,163,163,0.51)] bg-white pl-[14px] hover:bg-[#dbd7d7]"
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
                  </Button>
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
            <div className="px-[40px] pt-[20px]">
              {page === "projects" && <DisplayProjects />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
