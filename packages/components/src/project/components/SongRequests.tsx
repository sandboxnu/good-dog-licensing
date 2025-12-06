"use client";

import type { SongRequest } from ".prisma/client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import SongRequestComponent from "./SongRequest";

export default function SongRequests({
  songRequests,
  status,
}: {
  songRequests: SongRequest[];
  status: "TO_DO" | "IN_REVIEW" | "ACCEPTED";
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="border-[.5px] border-cream-500 rounded-2xl p-6 shadow-md flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-xl">To do</p>
          <p>Review and approve/deny the pending matches below</p>
        </div>
        <ChevronDown
          className={`h-6 w-6 ${dropdownOpen ? "rotate-0" : "-rotate-90"} transition-all`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
      </div>
      {dropdownOpen &&
        songRequests.map((songRequest) => (
          <SongRequestComponent songRequest={songRequest} />
        ))}
    </div>
  );
}
