"use client";

import { useState } from "react";

import { Button } from "@good-dog/ui/button";
import { Input } from "@good-dog/ui/input";

interface MusicSearchProps {
  music: { musicId: string; musicTitle: string; artistName: string }[];
  matchedMusicIds: string[];
  handleSelection: (musicId: string) => void;
  label: string;
}

type SearchOption = MusicSearchProps["music"][number];

export default function MusicSearch({
  music,
  matchedMusicIds,
  handleSelection,
  label,
}: MusicSearchProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchOptions, setSearchOptions] = useState<SearchOption[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);

    const potentialSearchOptions = music.filter((song) => {
      return (
        song.musicTitle.toLowerCase().includes(newSearchQuery.toLowerCase()) ||
        song.artistName.toLowerCase().includes(newSearchQuery.toLowerCase())
      );
    });
    const newSearchOptions: SearchOption[] = [];
    potentialSearchOptions.forEach((song) => {
      if (!matchedMusicIds.includes(song.musicId)) {
        newSearchOptions.push(song);
      }
    });
    setSearchOptions(newSearchOptions);
  };

  return (
    <>
      <div className="flex items-center pl-[58px] pt-[43px]">
        <div className="font-afacad text-2xl font-medium">{label}</div>
        <div className="pl-[8px]">
          <div className="group flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M9 9L9 12.375M9 6.49841V6.46875M2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9Z"
                stroke="#A3A3A3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="pl-[60px] pr-[80px] pt-[20px]">
        <Input
          className="h-[40px] w-full rounded-xl border-[1px] border-[#A3A3A382] bg-white pl-[10px] !text-lg"
          placeholder="Search"
          onChange={handleSearch}
        />
        {searchQuery !== "" && (
          <div className="flex w-full flex-col rounded-xl bg-white">
            {searchOptions.map((song) => {
              return (
                <Button
                  onClick={() => {
                    handleSelection(song.musicId);
                    setSearchQuery("");
                  }}
                  key={song.musicId}
                  className="flex w-full justify-start bg-white pl-[10px] pt-[4px] text-lg text-black hover:bg-[#ede9e8]"
                >
                  {'"' + song.musicTitle + '" by ' + song.artistName}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
