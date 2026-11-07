"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";

import Pagination, { usePagination } from "../../../base/Pagination";
import SongDrawer from "./SongDrawer";
import {
  MobileCard,
  MobileCardList,
  TABLE_DESKTOP_ONLY_CLASS,
  TableHeaderFormatting,
  TableOuterFormatting,
  TableRowFormatting,
} from "./TableFormatting";

type PendingSong = GetProcedureOutput<"pendingMusicForMusicians">[number];

const PAGE_SIZE = 25;

/** URL params that keep the Songs page on this tab with a song's drawer open. */
export const PENDING_TAB_PARAM = "tab=pending";
export const PENDING_SONG_ID_PARAM = "pendingSongId";

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const fullName = (user: { firstName: string; lastName: string } | null) =>
  user ? `${user.firstName} ${user.lastName}` : "—";

/**
 * Admin-only list of songs an admin posted on a musician's behalf that the
 * musician hasn't approved or declined yet. These songs can't be matched.
 */
export default function PendingMusicianReviewSection() {
  const [pendingSongs] = trpc.pendingMusicForMusicians.useSuspenseQuery();
  const { pageItems, paginationProps } = usePagination(pendingSongs, PAGE_SIZE);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedSong =
    pendingSongs.find(
      (song) => song.musicId === searchParams.get(PENDING_SONG_ID_PARAM),
    ) ?? null;

  const openSong = (song: PendingSong) =>
    router.replace(
      `?${PENDING_TAB_PARAM}&${PENDING_SONG_ID_PARAM}=${song.musicId}`,
      { scroll: false },
    );

  return (
    <div className="flex flex-col gap-[16px] pt-[16px]">
      <p className="text-body3 dark:text-gray-200">
        Songs posted on a musician&apos;s behalf. They can&apos;t be matched
        until the musician approves them.
      </p>
      <TableOuterFormatting>
        <MobileCardList>
          {pageItems.map((song) => (
            <MobileCard key={song.musicId} onClick={() => openSong(song)}>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="truncate text-body1 font-semibold text-dark-gray-500 dark:text-mint-300">
                  {song.songName}
                </p>
                <p className="truncate text-body3 text-dark-gray-300 dark:text-gray-200">
                  {song.performerName} · for {fullName(song.submitter)}
                </p>
              </div>
              <div className="flex flex-row items-center justify-between gap-3 text-caption text-dark-gray-300 dark:text-gray-300">
                <span>
                  Posted {formatDate(song.createdAt)} by{" "}
                  {fullName(song.postedByAdmin)}
                </span>
                <a
                  href={song.songLink}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-green-500 underline dark:text-mint-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open song
                </a>
              </div>
            </MobileCard>
          ))}
          {pendingSongs.length === 0 && <EmptyPendingMessage />}
        </MobileCardList>

        <div className={`flex flex-col ${TABLE_DESKTOP_ONLY_CLASS}`}>
          <TableHeaderFormatting columnCount={6}>
            <p className="dark:text-white">Song Name</p>
            <p className="dark:text-white">Artist</p>
            <p className="dark:text-white">Musician</p>
            <p className="dark:text-white">Posted By</p>
            <p className="dark:text-white">Date Posted</p>
            <p className="dark:text-white">Song Link</p>
          </TableHeaderFormatting>
          {pageItems.map((song, index) => (
            <div
              key={song.musicId}
              className="cursor-pointer"
              onClick={() => openSong(song)}
            >
              <TableRowFormatting
                isLast={index === pageItems.length - 1}
                columnCount={6}
              >
                <p className="truncate dark:text-white">{song.songName}</p>
                <p className="truncate dark:text-white">{song.performerName}</p>
                <p className="truncate dark:text-white">
                  {fullName(song.submitter)}
                </p>
                <p className="truncate dark:text-white">
                  {fullName(song.postedByAdmin)}
                </p>
                <p className="dark:text-white">{formatDate(song.createdAt)}</p>
                <a
                  href={song.songLink}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate dark:text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <u>{song.songLink}</u>
                </a>
              </TableRowFormatting>
            </div>
          ))}
          {pendingSongs.length === 0 && <EmptyPendingMessage />}
        </div>
        <Pagination {...paginationProps} />
      </TableOuterFormatting>
      {selectedSong && (
        <SongDrawer
          song={selectedSong}
          open={!!selectedSong}
          onClose={() =>
            router.replace(`${pathname}?${PENDING_TAB_PARAM}`, {
              scroll: false,
            })
          }
          pendingReview={{ postedBy: selectedSong.postedByAdmin }}
        />
      )}
    </div>
  );
}

function EmptyPendingMessage() {
  return (
    <p className="rounded-b-md border-[0.2px] border-t-0 border-cream-400 p-[16px] text-center text-body3 text-dark-gray-300 dark:text-dark-gray-100">
      No songs are waiting on a musician&apos;s review.
    </p>
  );
}
