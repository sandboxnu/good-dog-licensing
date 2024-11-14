import React from "react";
import Image from "next/image";

import LandingSubmission from "@good-dog/components/LandingSubmission";
import ProjectGallery from "@good-dog/components/ProjectGallery";

export default function Home() {
  return (
    <main className="bg-good-dog-violet">
      <Splash />
      <LandingSubmission />
      <LandingSubmission
        flipX
        flipY
        reverseLayout
        title="Music Makers"
        button="SEND US YOUR MUSIC"
      />
      <ProjectGallery />
    </main>
  );
}

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
        className="font-righteous font-semibold text-good-dog-violet"
        style={{ margin: "auto", width: "fit-content" }}
      >
        <a href="/submit">
          <div className="rounded-full bg-good-dog-celadon px-4 py-1">
            SUBMIT A BRIEF
          </div>
        </a>
      </div>
    </div>
  );
};
