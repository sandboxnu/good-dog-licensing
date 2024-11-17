"use client";

import React from "react";
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
  // const [visible, setVisible] = useState(true); // commented out code is an attempt to animate the content
  const reverseLayout = creator === "MUSICIANS";
  const creatorObj = CreatorData.find(
    (creatorObj) => creatorObj.creatorType === creator,
  );

  // commented out code is an attempt to animate the content, used to be in a useEffect
  // setVisible(false);
  // const timer = setTimeout(() => {

  // setVisible(true);
  // }, 500); // Duration of the fade-out transition

  // return () => clearTimeout(timer);

  return (
    <div className={`flex flex-row ${reverseLayout ? "flex-row-reverse" : ""}`}>
      {/* 
      commented out divs are attempts to animate the content; 
      <div
        className={`duration-350 transition-all ${visible ? "opacity-100" : "opacity-0"} ${reverseLayout ? "right-50" : "left-50"}`}
        style={{
          transform: visible
            ? "translateX(0)"
            : reverseLayout
              ? "translateX(100%)"
              : "translateX(-100%)",
        }}
      > */}
      <Image
        src={creatorObj?.imageSrc ?? ""}
        alt="creator image"
        width={593}
        height={676}
        style={{
          width: "593px",
          height: "676px",
        }}
      />
      {/* </div>
      <div
        className={`duration-350 transition-all ${visible ? "opacity-100" : "opacity-0"} ${reverseLayout ? "left-50" : "right-50"}`}
        style={{
          transform: visible
            ? "translateX(0)"
            : reverseLayout
              ? "translateX(-100%)"
              : "translateX(100%)",
        }}
      > */}
      <div className="m-9">
        <h1
          className={`font-righteous leading-none text-good-dog-celadon ${creator === "MUSICIANS" ? `text-8.5xl` : `text-10xl`}`}
        >
          {creator}
        </h1>
        <p className="py-8 text-white">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          pharetra lacus sit amet turpis suscipit, eget convallis elit
          condimentum. Etiam ac tortor ac lectus scelerisque mollis. Fusce
          tempus ornare rutrum. Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Cras congue, orci
          molestie euismod mollis, sapien nisi aliquet diam, vitae porta augue
          lacus eget elit. Mauris diam.
        </p>
        <div className="m-12 flex items-center justify-center">
          <a href="/submit">
            <div className="rounded-full bg-good-dog-celadon px-4 py-1 font-righteous font-semibold text-good-dog-violet">
              {creatorObj?.buttonText}
            </div>
          </a>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
