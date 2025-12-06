"use client";

import type { SongRequest } from ".prisma/client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import SongRequestComponent from "./SongRequest";
import Hourglass from "../../svg/Hourglass";

export default function SongRequests({
  songRequests,
  status,
}: {
  songRequests: SongRequest[];
  status: "TO_DO" | "IN_REVIEW" | "ACCEPTED" | "NO_MATCHES";
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const header = () => {
    if (status === "TO_DO") return "To do";
    if (status === "IN_REVIEW") return "In review";
    if (status === "ACCEPTED") return "Accepted";
    else return "No Matches";
  };

  const description = () => {
    if (status === "TO_DO")
      return "Review and approve/deny the pending matches below";
    if (status === "IN_REVIEW")
      return "Work awaiting musician and mediator input";
    if (status === "ACCEPTED")
      return "Requests in motion, stay tuned for updates";
    else return "No active matches for these requests";
  };

  return (
    <div
      className="bg-white border-[.5px] border-cream-500 rounded-2xl p-6 shadow-md flex flex-col gap-4 cursor-pointer"
      onClick={() => setDropdownOpen(!dropdownOpen)}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-xl">{header()}</p>
          <p>{description()}</p>
        </div>
        <ChevronDown
          className={`h-6 w-6 ${dropdownOpen ? "rotate-0" : "-rotate-90"} transition-all`}
        />
      </div>
      {dropdownOpen &&
        (songRequests.length !== 0 ? (
          songRequests.map((songRequest) => (
            <SongRequestComponent
              key={songRequest.songRequestId}
              songRequest={songRequest}
              status={status}
            />
          ))
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Hourglass size="small" />
            <p>No requests active at this time</p>
          </div>
        ))}
    </div>
  );
}
