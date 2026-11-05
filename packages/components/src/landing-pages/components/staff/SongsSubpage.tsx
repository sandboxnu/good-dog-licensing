"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { Genre } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";

import { getGenreLabel } from "../../../../utils/enumLabelMapper";
import { search } from "../../../../utils/search";
import MultiselectDropdownFilter from "../../../base/MultiSelectDropdownFilter";
import Pagination, { usePagination } from "../../../base/Pagination";
import SearchBar from "../../../base/SearchBar";
import Header from "../Header";
import SongDrawer from "./SongDrawer";
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
  return [...songs].sort((a, b) => {
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

// Genres can be stored more than once on a submission; show each one once.
const uniqueGenres = (song: MusicSubmission) => [...new Set(song.genres)];

// How many genre chips the desktop table shows before collapsing to "+N"
const MAX_GENRES_SHOWN = 3;

const matchesSearch = (song: MusicSubmission, query: string) =>
  search(song.songName, query) ||
  search(song.performerName, query) ||
  search(song.submitter.firstName + " " + song.submitter.lastName, query) ||
  song.genres.some((genre) => search(getGenreLabel(genre), query)) ||
  song.contributors.some((contributor) =>
    search(contributor.firstName + " " + contributor.lastName, query),
  );

const filterSongs = (
  songs: MusicSubmission[],
  searchQuery: string,
  selectedArtists: string[],
  selectedGenres: string[],
) =>
  songs.filter(
    (song) =>
      (selectedArtists.length === 0 ||
        selectedArtists.includes(song.performerName)) &&
      (selectedGenres.length === 0 ||
        song.genres.some((genre) => selectedGenres.includes(genre))) &&
      matchesSearch(song, searchQuery),
  );

const genreOptions = Object.values(Genre).map((genre) => ({
  label: getGenreLabel(genre),
  value: genre,
}));

/**
 * Song sub-page of admin dashboard.
 */
export default function SongsSubpage() {
  const [data] = trpc.allMusic.useSuspenseQuery();
  const [sortColumn, setSortColumn] = useState<SortColumn>("songName");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const songIdFromUrl = searchParams.get("songId");
  const selectedSong =
    data.find((song) => song.musicId === songIdFromUrl) ?? null;

  const artistOptions = [...new Set(data.map((song) => song.performerName))]
    .sort((a, b) => a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()))
    .map((name) => ({ label: name, value: name }));

  const { pageItems, paginationProps } = usePagination(
    sortSongs(
      filterSongs(data, searchQuery, selectedArtists, selectedGenres),
      sortColumn,
    ),
    PAGE_SIZE,
    `${sortColumn}-${searchQuery}-${selectedArtists.join()}-${selectedGenres.join()}`,
  );

  return (
    <div className="flex flex-col gap-[32px]">
      <Header title={"Songs"} subtitle={"Song submissions"} />
      <TableOuterFormatting>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-stretch gap-[12px] md:flex-row md:flex-wrap md:items-center md:gap-[16px]">
            <div className="w-full md:w-[300px]">
              <SearchBar
                onChange={setSearchQuery}
                placeholder="Search songs, artists, genres, or contributors"
              />
            </div>
            <div className="flex flex-row flex-wrap gap-2 md:ml-auto">
              <MultiselectDropdownFilter
                label="Artists"
                value={selectedArtists}
                onChange={setSelectedArtists}
                options={artistOptions}
                columns={1}
                searchBar
              />
              <MultiselectDropdownFilter
                label="Genre"
                value={selectedGenres}
                onChange={setSelectedGenres}
                options={genreOptions}
                columns={1}
                searchBar
              />
            </div>
          </div>
          {selectedArtists.length + selectedGenres.length > 0 && (
            <div className="flex flex-row flex-wrap gap-2">
              {selectedArtists.map((artist) => (
                <FilterChip
                  key={artist}
                  label={artist}
                  onRemove={() =>
                    setSelectedArtists(
                      selectedArtists.filter((a) => a !== artist),
                    )
                  }
                />
              ))}
              {selectedGenres.map((genre) => (
                <FilterChip
                  key={genre}
                  label={getGenreLabel(genre as Genre)}
                  onRemove={() =>
                    setSelectedGenres(selectedGenres.filter((g) => g !== genre))
                  }
                />
              ))}
            </div>
          )}
        </div>
        <SongTable
          data={pageItems}
          sortColumn={sortColumn}
          setSortColumn={setSortColumn}
          onSelectSong={(song) =>
            router.replace(`?songId=${song.musicId}`, { scroll: false })
          }
        />
        <Pagination {...paginationProps} />
      </TableOuterFormatting>
      {selectedSong && (
        <SongDrawer
          song={selectedSong}
          open={!!selectedSong}
          onClose={() => router.replace(pathname, { scroll: false })}
        />
      )}
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <Button
      variant="outlined"
      size="flex-text-with-icon"
      className="border border-[0.5px] border-green-400 bg-mint-300 hover:bg-mint-300 dark:border-mint-300 dark:bg-green-400 dark:hover:bg-green-400"
      onClick={onRemove}
    >
      <div className="flex items-center gap-1 text-green-400 dark:text-mint-300">
        <X className="h-4 w-4" />
        {label}
      </div>
    </Button>
  );
}

function SongTable({
  data,
  sortColumn,
  setSortColumn,
  onSelectSong,
}: {
  data: MusicSubmission[];
  sortColumn: SortColumn;
  setSortColumn: (newSort: SortColumn) => void;
  onSelectSong: (song: MusicSubmission) => void;
}) {
  return (
    <>
      <MobileSortSelect
        id="songsSort"
        value={sortColumn}
        options={SORT_OPTIONS}
        onChange={setSortColumn}
      />
      <MobileCardList>
        {data.map((song) => (
          <MobileCard key={song.musicId} onClick={() => onSelectSong(song)}>
            <div className="flex min-w-0 flex-col gap-1">
              <p className="truncate text-body1 font-semibold text-dark-gray-500 dark:text-mint-300">
                {song.songName}
              </p>
              <p className="truncate text-body3 text-dark-gray-300 dark:text-gray-200">
                {song.performerName}
              </p>
            </div>
            <div className="flex flex-row flex-wrap gap-1">
              {uniqueGenres(song).map((genre) => (
                <GenreCard genre={genre} key={genre} />
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
                onClick={(e) => e.stopPropagation()}
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
          {/* Genre spans two columns so up to three genre chips fit */}
          <p className="col-span-2 dark:text-white">Genre</p>
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
            <div
              className="cursor-pointer"
              onClick={() => onSelectSong(song)}
              key={song.musicId}
            >
              <TableRowFormatting
                isLast={key === data.length - 1}
                columnCount={6}
              >
                <p className="truncate dark:text-white">{song.songName}</p>
                <p className="truncate dark:text-white">{song.performerName}</p>
                <div className="col-span-2 flex min-w-0 flex-wrap gap-1 dark:text-white">
                  {uniqueGenres(song)
                    .slice(0, MAX_GENRES_SHOWN)
                    .map((genre) => (
                      <GenreCard genre={genre} key={genre} />
                    ))}
                  {uniqueGenres(song).length > MAX_GENRES_SHOWN && (
                    <div className="flex h-6 w-fit items-center justify-center gap-1 rounded-sm bg-gray-300 px-2 py-1 text-gray-500 dark:bg-gray-400">
                      +{uniqueGenres(song).length - MAX_GENRES_SHOWN}
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
                  rel="noreferrer"
                  className="truncate dark:text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <u>{song.songLink}</u>
                </a>
              </TableRowFormatting>
            </div>
          );
        })}
        {data.length == 0 && <TableEmptyMessage />}
      </div>
    </>
  );
}

function GenreCard({ genre }: { genre: Genre }) {
  return (
    <div className="flex h-6 w-fit items-center justify-center gap-1 rounded-sm bg-gray-300 px-2 py-1 text-gray-500 dark:bg-gray-400">
      {getGenreLabel(genre)}
    </div>
  );
}
