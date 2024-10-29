import React from "react";
import Image from "next/image";

import LandingSubmission from "@good-dog/components/LandingSubmission";
import PastProjects from "@good-dog/components/PastProjects";


export default function Home() {
  const Splash = () => {
    return (
      <div style={{ paddingTop: "10vh", paddingBottom: "15rem" }}>
        <Image
          src="/icons/Good Dog With Logo.svg"
          width={789}
          height={0}
          alt="good-dog-logo"
          style={{ margin: "auto", display: "block", marginBottom: "2.5rem" }}
        />
        <div
          className="font-righteous rounded-full bg-good-dog-celadon px-4 py-1 font-semibold text-good-dog-violet"
          style={{ margin: "auto", width: "fit-content" }}
        >
          <a href="/submit">SUBMIT A BRIEF</a>
        </div>
      </div>
    );
  };

  

  return (
    <main className="bg-good-dog-violet">
      <Splash />
      <LandingSubmission />
      <LandingSubmission
        flipX={true}
        flipY={true}
        reverseLayout={true}
        title="Music Makers"
        button="SEND US YOUR MUSIC"
      />
      <PastProjects />
    </main>
  );
}
