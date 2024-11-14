import React from "react";
import Image from "next/image";

import LandingSubmission from "@good-dog/components/LandingSubmission";
import ProjectGallery from "@good-dog/components/ProjectGallery";

export default function Home() {
  const Splash = () => {
    return (
      <div className="pb-60 pt-36">
        <Image
          src="/icons/Good Dog With Logo.svg"
          width={789}
          height={0}
          alt="good-dog-logo"
          style={{ margin: "auto", display: "block", marginBottom: "2.5rem" }}
        />
        <div className="font-righteous m-auto w-fit font-semibold text-good-dog-violet">
          <a href="/submit">
            <div className="rounded-full bg-good-dog-celadon px-4 py-1">
              SUBMIT A BRIEF
            </div>
          </a>
        </div>
      </div>
    );
  };

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
