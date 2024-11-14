"use client";

import React, { useEffect, useState } from "react";

import MediaMusicianContent from "./MediaMusicianContent";

export default function MediaMusicianAbout() {
  const [selectedCreator, setSelectedCreator] = useState<
    "MEDIA MAKERS" | "MUSICIANS"
  >("MEDIA MAKERS");

  useEffect(() => {
    console.log(selectedCreator);
  }, [selectedCreator]);

  return (
    <div className="py-20">
      <div className="font-righteous mb-9 flex flex-row justify-center">
        <button
          className={`rounded-l-full border px-4 ${selectedCreator === "MEDIA MAKERS" ? `border-good-dog-celadon bg-good-dog-celadon text-good-dog-violet` : `border-good-dog-pale-yellow text-good-dog-pale-yellow`}`}
          onClick={() => setSelectedCreator("MEDIA MAKERS")}
        >
          MEDIA MAKERS
        </button>
        <button
          className={`rounded-r-full border px-8 ${selectedCreator === "MUSICIANS" ? `border-good-dog-celadon bg-good-dog-celadon text-good-dog-violet` : `border-good-dog-pale-yellow text-good-dog-pale-yellow`} `}
          onClick={() => setSelectedCreator("MUSICIANS")}
        >
          MUSICIANS
        </button>
      </div>
      <MediaMusicianContent creator={selectedCreator} />
    </div>
  );
}
