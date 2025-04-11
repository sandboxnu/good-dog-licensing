import React from "react";
import Image from "next/image";
import Link from "next/link";

import LandingPage from "@good-dog/components/landing/LandingPage";

export default function Home() {
  return (
    <main>
      <LandingPage />
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
        className="m-auto mb-6 block"
      />

      <div className="font-regular m-auto mb-6 w-fit font-righteous text-2xl text-good-dog-celadon">
        "Connecting Creatives"
      </div>

      <div className="font-regular m-auto w-fit font-righteous text-good-dog-violet">
        <Link href="/submit">
          <div className="rounded-full bg-good-dog-celadon px-6 py-2 text-5xl">
            SUBMIT A BRIEF
          </div>
        </Link>
      </div>
    </div>
  );
};
