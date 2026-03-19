"use client";
import { useState } from "react";

interface FootnoteProps {
  number: number;
  tooltip: string;
}

export default function Footnote({
  number,
  tooltip,
}: {
  number: number;
  tooltip: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative">
      <sup
        className="cursor-pointer font-afacad font-medium not-italic leading-[128%] text-[#07634C] underline"
        onClick={() => setOpen(!open)}
      >
        [{number}]
      </sup>
      {open && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-[200px] rounded-[8px] bg-[#2E2E2E] px-[12px] py-[8px] text-[12px] text-white shadow-md z-10">
          {tooltip}
        </span>
      )}
    </span>
  );
}
