"use client";

import { useState } from "react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";

import Pagination, { usePagination } from "../../../base/Pagination";
import Header from "../Header";
import SortableTableColumnHeader from "./SortableTableColumnHeader";
import {
  MobileCard,
  MobileCardList,
  MobileSortSelect,
  TABLE_DESKTOP_ONLY_CLASS,
  TableEmptyMessage,
  TableHeaderFormatting,
  TableOuterFormatting,
  TableRowFormatting,
} from "./TableFormatting";

type MusicSubmission = GetProcedureOutput<"allMusic">[number];

type SortColumn = "songName" | "musicianName" | "dateSubmitted";

const PAGE_SIZE = 10;

const SORT_OPTIONS: { value: SortColumn; label: string }[] = [
  { value: "songName", label: "Song name" },
  { value: "musicianName", label: "Musician" },
  { value: "dateSubmitted", label: "Date submitted" },
];

const sortSongs = (songs: MusicSubmission[], sortColumn: SortColumn) => {
  return songs.sort((a, b) => {
    switch (sortColumn) {
      case "songName":
        return a.songName
          .toLocaleLowerCase()
          .localeCompare(b.songName.toLocaleLowerCase());
      case "musicianName":
        return a.performerName
          .toLocaleLowerCase()
          .localeCompare(b.performerName.toLocaleLowerCase());
      case "dateSubmitted":
        return a.createdAt.getTime() - b.createdAt.getTime();
    }
  });
};

/**
 * Song sub-page of admin dashboard.
 */
export default function SongsSubpage() {
  const [data] = trpc.allMusic.useSuspenseQuery();
  const [sortColumn, setSortColumn] = useState<SortColumn>("songName");

  const { pageItems, paginationProps } = usePagination(
    sortSongs(data, sortColumn),
    PAGE_SIZE,
    sortColumn,
  );

  return (
    <div className="flex flex-col gap-[32px]">
      <Header title={"Songs"} subtitle={"Song submissions"} />
      <SongTable
        data={pageItems}
        sortColumn={sortColumn}
        setSortColumn={setSortColumn}
        paginationProps={paginationProps}
      />
    </div>
  );
}

function SongTable({
  data,
  sortColumn,
  setSortColumn,
  paginationProps,
}: {
  data: MusicSubmission[];
  sortColumn: SortColumn;
  setSortColumn: (newSort: SortColumn) => void;
  paginationProps: React.ComponentProps<typeof Pagination>;
}) {
  return (
    <TableOuterFormatting>
      <MobileSortSelect
        id="songsSort"
        value={sortColumn}
        options={SORT_OPTIONS}
        onChange={setSortColumn}
      />
      <MobileCardList>
        {data.map((song) => (
          <MobileCard key={song.musicId}>
            <div className="flex min-w-0 flex-col gap-1">
              <p className="truncate text-body1 font-semibold text-dark-gray-500 dark:text-mint-300">
                {song.songName}
              </p>
              <p className="truncate text-body3 text-dark-gray-300 dark:text-gray-200">
                {song.performerName}
              </p>
            </div>
            <div className="flex flex-row flex-wrap gap-1">
              {song.genres.map((genre, index) => (
                <GenreCard genre={genre} key={index} />
              ))}
            </div>
            <div className="flex flex-row items-center justify-between gap-3 text-caption text-dark-gray-300 dark:text-gray-300">
              <span>
                Submitted{" "}
                {song.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <a
                href={song.songLink}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-green-500 underline dark:text-mint-200"
              >
                Open song
              </a>
            </div>
          </MobileCard>
        ))}
        {data.length == 0 && <TableEmptyMessage />}
      </MobileCardList>

      <div className={`flex flex-col ${TABLE_DESKTOP_ONLY_CLASS}`}>
        <TableHeaderFormatting columnCount={6}>
          <SortableTableColumnHeader
            columnName="Song Name"
            currentSort={sortColumn}
            sortColumn="songName"
            setSortColumn={setSortColumn}
          />
          <SortableTableColumnHeader
            columnName="Musician"
            currentSort={sortColumn}
            sortColumn="musicianName"
            setSortColumn={setSortColumn}
          />
          <p className="dark:text-white">Genre</p>
          <SortableTableColumnHeader
            columnName="Date Submitted"
            currentSort={sortColumn}
            sortColumn="dateSubmitted"
            setSortColumn={setSortColumn}
          />
          <p className="dark:text-white">Song Link</p>
        </TableHeaderFormatting>

        {data.map((song: MusicSubmission, key) => {
          return (
            <TableRowFormatting
              key={song.musicId}
              isLast={key === data.length - 1}
              columnCount={6}
            >
              <p className="truncate dark:text-white">{song.songName}</p>
              <p className="truncate dark:text-white">{song.performerName}</p>
              <div className="flex gap-1 overflow-hidden dark:text-white">
                {song.genres.slice(0, 1).map((genre, index) => (
                  <GenreCard genre={genre} key={index} />
                ))}
                {song.genres.length > 1 && (
                  <div className="flex h-6 w-fit items-center justify-center gap-1 rounded-sm bg-gray-300 px-2 py-1 text-gray-500 dark:bg-gray-400">
                    +{song.genres.length - 1}
                  </div>
                )}
              </div>
              <p className="dark:text-white">
                {song.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <a
                href={song.songLink}
                target="_blank"
                className="truncate dark:text-white"
              >
                <u>{song.songLink}</u>
              </a>
            </TableRowFormatting>
          );
        })}
        {data.length == 0 && <TableEmptyMessage />}
      </div>
      <Pagination {...paginationProps} />
    </TableOuterFormatting>
  );
}

function GenreCard({ genre }: { genre: string }) {
  return (
    <div className="flex h-6 w-fit items-center justify-center gap-1 rounded-sm bg-gray-300 px-2 py-1 text-gray-500 dark:bg-gray-400">
      {genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase()}
    </div>
  );
}
