"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const CreatorData = [
  {
    creatorType: "MEDIA MAKERS",
    buttonText: "SUBMIT A BRIEF",
    imageSrc: "/images/mediaMakerAbout.png",
    description:
      "Step one for media makers is submitting a brief. From there, our team of music supervisors works closely with the media maker to find the best fitting music. Our team will then handle all communication and solicitation with the artists and drawing up the license agreements creating an extremely seamless and easy process for the media maker obtaining free music! Good Dog Licensing is all about uplifting independent artists and connecting creatives so don’t hesitate - submit your brief and get started!",
  },
  {
    creatorType: "MUSICIANS",
    buttonText: "SEND US YOUR MUSIC",
    imageSrc: "/images/musicianAbout.png",
    description:
      "Synch credits have quickly become one of the greatest ways for a musician to build a career out of their music. Through Good Dog Licensing, we offer independent artists the chance to build up their repertoire of sync credits while keeping 100% of their rights. This is especially important for up and coming artists as other synch opportunities may not guarantee this level of security. Additionally, there is even a chance to monetize your sync credit through backend royalties to be made from any public performances of the project your music will be featured in! Good Dog Licensing is all about uplifting independent artists and connecting creatives so don’t hesitate - submit your music!",
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
        <p className="py-8 text-white">{creatorObj?.description}</p>
        <div className="m-12 flex items-center justify-center">
          <Link href="/submit">
            <div className="rounded-full bg-good-dog-celadon px-4 py-1 font-righteous font-semibold text-good-dog-violet">
              {creatorObj?.buttonText}
            </div>
          </Link>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
