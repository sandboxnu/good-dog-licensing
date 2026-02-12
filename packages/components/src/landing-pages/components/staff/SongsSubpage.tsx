"use client";

import { trpc } from "@good-dog/trpc/client";
import Header from "../Header";
import type { MusicSubmission } from "@prisma/client";
import {
  TableHeaderFormatting,
  TableOuterFormatting,
  TableRowFormatting,
} from "./TableFormatting";

/**
 * Song sub-page of admin dashboard.
 */
export default function Songs() {
  const [data] = trpc.music.useSuspenseQuery();
  return (
    <div className="flex flex-col gap-[32px]">
      <Header
        title={"Songs"}
        subtitle={"Subtitle here"}
        requestPath={""}
        buttonContent="Invite"
      />
      <SongTable data={data.music} />
    </div>
  );
}

function SongTable({ data }: { data: MusicSubmission[] }) {

  return (
    <TableOuterFormatting>
      <div className="flex flex-col">
        <TableHeaderFormatting columnCount={6}>
          <p>Song Name</p>
          <p>Musician</p>
          <p>Genre</p>
          <p>Date Submitted</p>
          <p>Song Link</p>
        </TableHeaderFormatting>

        {data.map((user: MusicSubmission, key) => {
          return (
            <TableRowFormatting
              key={key}
              isLast={key === data.length - 1}
              columnCount={6}
            >
              <p className="truncate">{user.songName}</p>
              <p className="truncate">{user.performerName}</p>
              <div className="flex gap-1 overflow-hidden">
                {user.genres.slice(0, 1).map((genre, index) => (
                  <GenreCard genre={genre} key={index} />
                ))}
                {user.genres.length > 1 && (
                  <div className="flex h-6 px-2 py-1 justify-center items-center gap-1 bg-gray-300 dark:bg-gray-400 text-gray-500 rounded w-fit">
                    +{user.genres.length - 2}
                  </div>
                )}
              </div>
              <p>
                {user.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <a href={user.songLink} className="truncate">
                <u>{user.songLink}</u>
              </a>
            </TableRowFormatting>
          );
        })}
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
