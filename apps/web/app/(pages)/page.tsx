import React from "react";
import Image from "next/image";
import Link from "next/link";

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
    <div className="pb-60 pt-36">
      <Image
        src="/icons/Good Dog With Logo.svg"
        width={789}
        height={0}
        alt="good-dog-logo"
        style={{ margin: "auto", display: "block", marginBottom: "2.5rem" }}
      />
      <div className="m-auto w-fit font-righteous font-semibold text-good-dog-violet">
        <Link href="/submit">
          <div className="rounded-full bg-good-dog-celadon px-4 py-1">
            SUBMIT A BRIEF
          </div>
        </Link>
      </div>
    </div>
  );
};
