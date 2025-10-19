import React from "react";
import Image from "next/image";
import Link from "next/link";

import LandingSubmission from "@good-dog/components/oldStuff/LandingSubmission";
import ProjectGallery from "@good-dog/components/oldStuff/ProjectGallery";

import { Button } from "@good-dog/ui/button";

export default function Home() {
  return (
    <div className="text-center">
      <div className="font-['Righteous'] text-[75px] font-normal leading-[80px]">
      <h1>Connecting musicians and media makers</h1>
    </div>
    <div>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco </p>
    </div>
    <Button size="lg" className="bg-dark-green shadow-[4px_4px_rgba(0,0,0,1)]">Get Started</Button>
    <Button size="lg" variant="outline" className="shadow-[4px_4px_rgba(0,0,0,1)]">Get Started</Button>
    </div>
  );
}

// export default function Home() {
//   return (
//     <main className="bg-good-dog-violet">
//       <Splash />
//       <LandingSubmission />
//       <LandingSubmission
//         flipX
//         flipY
//         reverseLayout
//         title="Musicians"
//         description="Your music should be heard! Good Dog Licensing is all about expanding your audience and bringing your music to new heights. Artists retain 100% of all rights when they license through Good Dog! All filmmakers are required to fill out cue sheets as well, so we offer artists a chance at earning backend royalties. With no extra work for you whatsoever, Good Dog can help you reach new listeners and make great new connections within the entertainment industry!"
//         button="SEND US YOUR MUSIC"
//       />
//       <ProjectGallery />
//     </main>
//   );
// }

// const Splash = () => {
//   return (
//     <div className="pb-60 pt-36">
//       <Image
//         src="/icons/Good Dog With Logo.svg"
//         width={789}
//         height={0}
//         alt="good-dog-logo"
//         className="m-auto mb-6 block"
//       />

//       <div className="font-regular m-auto mb-6 w-fit font-righteous text-2xl text-good-dog-celadon">
//         "Connecting Creatives"
//       </div>

//       <div className="font-regular m-auto w-fit font-righteous text-good-dog-violet">
//         <Link href="/submit">
//           <div className="rounded-full bg-good-dog-celadon px-6 py-2 text-5xl">
//             SUBMIT A BRIEF
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// };
