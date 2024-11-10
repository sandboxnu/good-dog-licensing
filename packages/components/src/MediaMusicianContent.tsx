"use cient";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const CreatorData = [
  {
    creatorType: "MEDIA MAKERS",
    buttonText: "SUBMIT A BRIEF",
    imageSrc: "/images/mediaMakerAbout.png",
  },
  {
    creatorType: "MUSICIANS",
    buttonText: "SEND US YOUR MUSIC",
    imageSrc: "/images/musicianAbout.png",
  },
];

export default function MediaMusicianContent({ creator = "MEDIA MAKERS" }) {
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [reverseLayout, setReverseLayout] = useState(
    creator === "MUSICIANS" ? true : false,
  );
  const creatorObj = CreatorData.find(
    (creatorObj) => creatorObj.creatorType === creator,
  );
  const imageFlipClasses = `
    ${flipX ? "scale-x-[-1]" : ""}
    ${flipY ? "scale-y-[-1]" : ""}
  `;

  useEffect(() => {
    if (creator === "MUSICIANS") {
      setReverseLayout(true);
      setFlipX(true);
      setFlipY(true);
    } else {
      setReverseLayout(false);
      setFlipX(false);
      setFlipY(false);
    }
  }, [creator]);

  return (
    <div className={`flex flex-row ${reverseLayout ? "flex-row-reverse" : ""}`}>
      <Image
        src={creatorObj?.imageSrc || ""}
        alt="creator image"
        width={593}
        height={676}
        style={{ width: "593px", height: "676px", float: "left" }}
      />
      <div className="m-9">
        <h1
          className={`font-righteous leading-none text-good-dog-celadon ${creator === "MUSICIANS" ? `text-8.5xl` : `text-10xl`}`}
        >
          {creator}
        </h1>
        <p style={{ paddingTop: "3vh" }} className="text-white">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          pharetra lacus sit amet turpis suscipit, eget convallis elit
          condimentum. Etiam ac tortor ac lectus scelerisque mollis. Fusce
          tempus ornare rutrum. Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Cras congue, orci
          molestie euismod mollis, sapien nisi aliquet diam, vitae porta augue
          lacus eget elit. Mauris diam.
        </p>
        <div className="m-16 flex items-center justify-center">
          <a href="/submit">
            <div
              className="font-righteous rounded-full bg-good-dog-celadon px-4 py-1 font-semibold text-good-dog-violet"
              style={{ width: "fit-content" }}
            >
              {creatorObj?.buttonText}
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
