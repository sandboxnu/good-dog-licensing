"use client";

import React, { useState } from "react";

import InviteModeratorModal from "./InviteModeratorModal";

export default function NewAdminDashboard() {
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);

  return (
    <div className="h-screen w-full bg-[#DEE0E2] p-[60px]">
      <div className="flex rounded-xl bg-[#F6F8FA]">
        <div className="w-1/5 bg-red-100">test</div>
        <div className="w-4/5 px-[36px] pt-[40px]">
          <div className="flex rounded-xl bg-white px-[38px] pt-[30px]">
            <div className="font-afacad w-1/2 text-3xl font-semibold text-black">
              Users
            </div>
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
            {showInviteModal && (
              <div className="fixed inset-0 flex justify-end pr-[150px] pt-[180px]">
                <InviteModeratorModal
                  handleFinished={() => {
                    setShowInviteModal(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
