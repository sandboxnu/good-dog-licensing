"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";

import { trpc } from "@good-dog/trpc/client";

export default function DisplaySongs() {
  const music = trpc.music.useSuspenseQuery();

  const [displayMusic, setDisplayMusic] =
    useState<boolean>(true);

  return (
    <div>
      <div className="flex space-x-4">
        <div
          onClick={() => {
            setDisplayMusic(true);
          }}
          className={clsx(
            "font-afacad cursor-pointer text-lg font-medium text-[#015643]",
            {
              "underline underline-offset-8": displayMusic,
              "text-black": !displayMusic,
            },
          )}
        >
          Music
        </div>
      </div>
      <div className="h-[2px] bg-[#D7D8D9]"></div>
      <div className="px-[40px] pt-[20px]">
        <div className="flex h-[45px] w-full bg-[#F1F5F9]">
          <div className="font-afacad flex w-1/4 items-center justify-start pl-[20px] text-lg font-normal text-black">
            Song Title
          </div>
          <div className="font-afacad flex w-1/4 items-center justify-start text-lg font-normal text-black">
            Artist
          </div>
          <div className="font-afacad flex w-1/4 items-center justify-start text-lg font-normal text-black">
            Genres
          </div>
          <div className="font-afacad flex w-1/4 items-center justify-start text-lg font-normal text-black">
            Link
          </div>
        </div>
        {displayMusic && (
          <div className="h-[400px] overflow-auto">
            {music[0].music.map((song) => {
              return (
                <div key={song.musicId} className="flex flex-col">
                  <div className="flex h-[60px] w-full bg-white">
                    <div className="font-afacad flex w-1/4 items-center justify-start pl-[20px] text-lg font-normal text-black">
                      {song.songName}
                    </div>
                    <div className="font-afacad flex w-1/4 items-center justify-start text-lg font-normal text-black">
                      {song.submitter.firstName + " " + song.submitter.lastName}
                    </div>
                    <div className="font-afacad flex w-1/4 items-center justify-start text-lg font-normal text-black">
                      {song.genre}
                    </div>
                    <div className="font-afacad flex w-1/4 items-center justify-start text-lg font-normal text-black">
                      <Link
                        target="_blank"
                        href={song.songLink}
                        className="font-afacad rounded-xl border border-[#A3A3A3] bg-[#A3A3A382] p-[4px] text-lg font-normal text-black"
                      >
                        Song Link
                      </Link>
                    </div>
                  </div>
                  <div className="h-[1px] w-full bg-[#D7D8D9]"></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
