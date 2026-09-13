"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Client-side pagination over an already-fetched list. Returns the rows for the
 * current page plus the props to spread onto `<Pagination />`.
 */
export function usePagination<T>(
  items: T[],
  /** Changing this (e.g. the active filter or sort) sends the user back to page one. */
  resetKey?: string,
  pageSize = DEFAULT_PAGE_SIZE,
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
      <ArrowButton
        label="Previous page"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-[16px] w-[16px]" />
      </ArrowButton>

      {pageNumbers(page, pageCount).map((p, key) =>
        p === "…" ? (
          <span key={key} className="text-caption text-dark-gray-300">
            …
          </span>
        ) : (
          <button
            key={key}
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPageChange(p)}
            className={`h-[32px] min-w-[32px] rounded-[8px] px-[8px] text-caption font-medium ${
              p === page
                ? "bg-green-400 text-gray-100"
                : "text-dark-gray-500 hover:bg-cream-100 dark:text-white dark:hover:bg-dark-gray-500"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <ArrowButton
        label="Next page"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-[16px] w-[16px]" />
      </ArrowButton>
    </nav>
  );
}

function ArrowButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] text-dark-gray-500 hover:bg-cream-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-white dark:hover:bg-dark-gray-500"
    >
      {children}
    </button>
  );
}
