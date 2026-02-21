"use client";

import { trpc } from "@good-dog/trpc/client";
import Header from "../Header";
import {
  TableEmptyMessage,
  TableHeaderFormatting,
  TableOuterFormatting,
  TableRowFormatting,
} from "./TableFormatting";
import type { GetProcedureOutput } from "@good-dog/trpc/types";

type MusicSubmission = GetProcedureOutput<"allMusic">[number];

/**
 * Song sub-page of admin dashboard.
 */
export default function SongsSubpage() {
  const [data] = trpc.allMusic.useSuspenseQuery();
  return (
    <div className="flex flex-col gap-[32px]">
      <Header
        title={"Songs"}
        subtitle={"Song submissions"}
        requestPath={""}
        buttonContent="Invite"
      />
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
              <p className="dark:text-white truncate">{user.songName}</p>
              <p className="dark:text-white truncate">{user.performerName}</p>
              <div className="dark:text-white flex gap-1 overflow-hidden">
                {user.genres.slice(0, 1).map((genre, index) => (
                  <GenreCard genre={genre} key={index} />
                ))}
                {user.genres.length > 1 && (
                  <div className="flex h-6 px-2 py-1 justify-center items-center gap-1 bg-gray-300 dark:bg-gray-400 text-gray-500 rounded w-fit">
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
              <a href={user.songLink} className="dark:text-white truncate">
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
    <div className="flex h-6 px-2 py-1 justify-center items-center gap-1 bg-gray-300 dark:bg-gray-400 text-gray-500 rounded w-fit">
      {genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase()}
    </div>
  );
}
