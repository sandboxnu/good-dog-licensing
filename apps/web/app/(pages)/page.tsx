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
        title="Musicians"
        button="SEND US YOUR MUSIC"
      />
      <ProjectGallery />
    </main>
  );
}

const Splash = () => {
  return (
    <div className="pb-60 pt-36">
      <Image
        src="/icons/Good Dog With Logo.svg"
        width={789}
        height={0}
        alt="good-dog-logo"
        style={{ margin: "auto", display: "block", marginBottom: "1.5rem" }}
      />

      <div className="font-regular m-auto mb-6 w-fit font-righteous text-2xl text-good-dog-celadon">
        "Connecting Creatives"
      </div>

      <div className="font-regular m-auto w-fit font-righteous text-good-dog-violet">
        <a href="/submit">
          <div className="rounded-full bg-good-dog-celadon px-6 py-2 text-5xl">
            SUBMIT A BRIEF
          </div>
        </a>
      </div>
    </div>
  );
};
