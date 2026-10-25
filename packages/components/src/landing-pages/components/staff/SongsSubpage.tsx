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
  TableEmptyMessage,
  TableHeaderFormatting,
  TableOuterFormatting,
  TableRowFormatting,
} from "./TableFormatting";

type MusicSubmission = GetProcedureOutput<"allMusic">[number];

type SortColumn = "songName" | "musicianName" | "dateSubmitted";

const PAGE_SIZE = 10;

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
          <div className="flex flex-row flex-wrap items-center gap-[16px]">
            <div className="w-[300px]">
              <SearchBar
                onChange={setSearchQuery}
                placeholder="Search songs, artists, genres, or contributors"
              />
            </div>
            <div className="ml-auto flex flex-row gap-2">
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
    <div className="flex flex-col">
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
              <div className="flex gap-1 overflow-hidden dark:text-white">
                {song.genres.slice(0, 1).map((genre) => (
                  <GenreCard genre={genre} key={genre} />
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
  );
}

function GenreCard({ genre }: { genre: Genre }) {
  return (
    <div className="flex h-6 w-fit items-center justify-center gap-1 rounded-sm bg-gray-300 px-2 py-1 text-gray-500 dark:bg-gray-400">
      {getGenreLabel(genre)}
    </div>
  );
}
