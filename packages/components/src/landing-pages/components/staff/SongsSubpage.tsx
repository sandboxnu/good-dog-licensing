"use client";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";

import Header from "../Header";
import {
  TableEmptyMessage,
  TableHeaderFormatting,
  TableOuterFormatting,
  TableRowFormatting,
} from "./TableFormatting";

type MusicSubmission = GetProcedureOutput<"allMusic">[number];

/**
 * Song sub-page of admin dashboard.
 */
export default function SongsSubpage() {
  const [data] = trpc.allMusic.useSuspenseQuery();
  return (
    <div className="flex flex-col gap-[32px]">
      <Header title={"Songs"} subtitle={"Song submissions"} />
      <SongTable data={data} />
    </div>
  );
}

function SongTable({ data }: { data: MusicSubmission[] }) {
  return (
    <TableOuterFormatting>
      <div className="flex flex-col">
        <TableHeaderFormatting columnCount={6}>
          <p className="dark:text-white">Song Name</p>
          <p className="dark:text-white">Musician</p>
          <p className="dark:text-white">Genre</p>
          <p className="dark:text-white">Date Submitted</p>
          <p className="dark:text-white">Song Link</p>
        </TableHeaderFormatting>

        {data.map((user: MusicSubmission, key) => {
          return (
            <TableRowFormatting
              key={key}
              isLast={key === data.length - 1}
              columnCount={6}
            >
              <p className="truncate dark:text-white">{user.songName}</p>
              <p className="truncate dark:text-white">{user.performerName}</p>
              <div className="flex gap-1 overflow-hidden dark:text-white">
                {user.genres.slice(0, 1).map((genre, index) => (
                  <GenreCard genre={genre} key={index} />
                ))}
                {user.genres.length > 1 && (
                  <div className="flex h-6 w-fit items-center justify-center gap-1 rounded bg-gray-300 px-2 py-1 text-gray-500 dark:bg-gray-400">
                    +{user.genres.length - 2}
                  </div>
                )}
              </div>
              <p className="dark:text-white">
                {user.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <a
                href={user.songLink}
                target="_blank"
                className="dark:text-white truncate"
              >
                <u>{user.songLink}</u>
              </a>
            </TableRowFormatting>
          );
        })}
        {data.length == 0 && <TableEmptyMessage />}
      </div>
    </TableOuterFormatting>
  );
}

function GenreCard({ genre }: { genre: string }) {
  return (
    <div className="flex h-6 w-fit items-center justify-center gap-1 rounded bg-gray-300 px-2 py-1 text-gray-500 dark:bg-gray-400">
      {genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase()}
    </div>
  );
}
