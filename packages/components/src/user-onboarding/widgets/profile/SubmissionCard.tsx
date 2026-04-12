"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

function TruncatedText({
  text,
  limit = 120,
}: {
  text: string;
  limit?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= limit) {
    return (
      <p className="text-base text-dark-gray-300 dark:text-cream-400">{text}</p>
    );
  }

  return (
    <p className="text-base text-dark-gray-300 dark:text-cream-400">
      {expanded ? text : text.slice(0, limit) + "..."}
      <button
        className="ml-1 text-green-300 dark:text-mint-200"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "See less" : "See more"}
      </button>
    </p>
  );
}

export default function SubmissionCard({
  title,
  tags,
  children,
}: {
  title: string;
  tags?: string[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col rounded-2xl border-[0.5px] border-cream-400 dark:border-cream-600">
      <div
        className={`flex cursor-pointer flex-row items-center gap-4 px-6 ${open ? "pt-4" : "py-4"}`}
        onClick={() => setOpen(!open)}
      >
        <ChevronRight
          className={`h-5 w-5 text-dark-gray-500 transition-all dark:text-gray-300 ${open && "rotate-90"}`}
        />
        <p className="text-base font-semibold text-green-400 dark:text-mint-200">
          {title}
        </p>
        {!open && tags && tags.length > 0 && (
          <div className="flex flex-row gap-1">
            {tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-full border-[0.5px] border-gray-400 bg-gray-300 px-2 py-0.5 text-sm text-gray-500 dark:border-dark-gray-200 dark:bg-gray-500 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {open && (
        <div className="flex flex-col gap-5 px-10 pb-6 pt-2">{children}</div>
      )}
    </div>
  );
}

export { TruncatedText };
