"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@good-dog/ui/button";

/**
 * Client-side pagination over an already-fetched list. Returns the rows for the
 * current page plus the props to spread onto `<Pagination />`.
 */
export function usePagination<T>(
  items: T[],
  pageSize: number,
  /** Changing this (e.g. the active filter or sort) sends the user back to page one. */
  resetKey?: string,
) {
  const [requestedPage, setRequestedPage] = useState(1);
  const [lastResetKey, setLastResetKey] = useState(resetKey);

  if (lastResetKey !== resetKey) {
    setLastResetKey(resetKey);
    setRequestedPage(1);
  }

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  // Clamp so a shrinking list can never strand the user on an empty page.
  const page = Math.min(requestedPage, pageCount);

  return {
    pageItems: items.slice((page - 1) * pageSize, page * pageSize),
    paginationProps: { page, pageCount, onPageChange: setRequestedPage },
  };
}

/** The first page, the last page and the pages around the current one: [1, "…", 4, 5, 6, "…", 20] */
function pageNumbers(page: number, pageCount: number) {
  const pages = [...new Set([1, page - 1, page, page + 1, pageCount])]
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);

  const withGaps: (number | "…")[] = [];
  let previous = 0;
  for (const p of pages) {
    if (previous > 0 && p - previous > 1) withGaps.push("…");
    withGaps.push(p);
    previous = p;
  }
  return withGaps;
}

/** Centres the icon and dims the arrow once there is nowhere left to go. */
const ARROW_CLASSES =
  "flex items-center justify-center disabled:opacity-40 disabled:hover:bg-transparent";

export default function Pagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-row items-center justify-center gap-[8px]"
    >
      <Button
        variant="text"
        size="small-icon"
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={ARROW_CLASSES}
      >
        <ChevronLeft className="h-[16px] w-[16px]" />
      </Button>

      {pageNumbers(page, pageCount).map((p, key) =>
        p === "…" ? (
          <span
            key={key}
            className="text-caption text-dark-gray-300 dark:text-dark-gray-100"
          >
            …
          </span>
        ) : (
          <Button
            key={key}
            variant={p === page ? "contained" : "text"}
            size="small-icon"
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ),
      )}

      <Button
        variant="text"
        size="small-icon"
        type="button"
        aria-label="Next page"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        className={ARROW_CLASSES}
      >
        <ChevronRight className="h-[16px] w-[16px]" />
      </Button>
    </nav>
  );
}
