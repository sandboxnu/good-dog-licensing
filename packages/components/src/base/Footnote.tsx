"use client";

import { useEffect, useState } from "react";

export default function Footnote({
  number,
  tooltip,
}: {
  number: number;
  tooltip: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail !== number) setOpen(false);
    };
    window.addEventListener("close-footnotes", handler as EventListener);
    return () =>
      window.removeEventListener("close-footnotes", handler as EventListener);
  }, [number]);

  const handleClick = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      window.dispatchEvent(
        new CustomEvent("close-footnotes", { detail: number }),
      );
    }
  };

  return (
    <span className="relative">
      <sup
        className="font-afacad cursor-pointer font-medium not-italic leading-[128%] text-green-400 hover:underline dark:text-mint-200"
        onClick={handleClick}
      >
        [{number}]
      </sup>
      {open && (
        <span className="absolute bottom-full left-1/2 z-10 mb-1 flex w-[400px] -translate-x-1/2 flex-col items-start justify-center rounded-[8px] border border-cream-500 bg-gray-100 p-[16px] dark:border-[#403F3E] dark:bg-dark-gray-600 dark:shadow-[0_2px_6px_0_#171717]">
          <span className="text-[14px] font-normal leading-[96%] text-gray-500 dark:text-gray-300">
            {tooltip}
          </span>
        </span>
      )}
    </span>
  );
}
