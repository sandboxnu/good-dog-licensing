"use client";

import { ChevronLeft } from "lucide-react";

export default function SongRequestDashboard({ projectId }: { projectId: string }) {
  return (
    <div className="w-[992px] flex flex-col gap-6">
      <div className="flex flex-row items-center text-secondary hover:cursor-pointer">
        <ChevronLeft className="h-4 w-4" />
        <p className="underline">Projects</p>
      </div>
    </div>
  );
}