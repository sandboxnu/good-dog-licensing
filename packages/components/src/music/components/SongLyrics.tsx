"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ScrollText } from "lucide-react";

interface SongLyricsProps {
  lyrics: string;
  variant?: "compact" | "detail";
}

export default function SongLyrics({
  lyrics,
  variant = "compact",
}: SongLyricsProps) {
  const [open, setOpen] = useState(false);

  if (lyrics.length === 0) {
    return null;
  }

  if (variant === "detail") {
    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex flex-row items-center gap-1 self-start text-dark-gray-200 dark:text-dark-gray-100"
        >
          Lyrics
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {open && (
          <p className="whitespace-pre-wrap break-words text-dark-gray-500 dark:text-gray-200">
            {lyrics}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex flex-row items-center gap-1 self-start group"
      >
        <ScrollText className="h-4 w-4 text-gray-400 group-hover:text-cream-600 dark:text-gray-400 dark:group-hover:text-gray-200" />
        <p className="text-sm text-dark-gray-300 dark:text-gray-200">Lyrics</p>
        {open ? (
          <ChevronDown className="h-4 w-4 text-dark-gray-300 dark:text-gray-200" />
        ) : (
          <ChevronRight className="h-4 w-4 text-dark-gray-300 dark:text-gray-200" />
        )}
      </button>
      {open && (
        <p className="whitespace-pre-wrap break-words text-dark-gray-500 dark:text-gray-200">
          {lyrics}
        </p>
      )}
    </div>
  );
}
