// import React from "react";
// import Image from "next/image";
// import Link from "next/link";

import TextInput from "@good-dog/components/base/TextInput";

// import LandingSubmission from "@good-dog/components/LandingSubmission";
// import ProjectGallery from "@good-dog/components/ProjectGallery";

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

export default function Home() {
  return (
    <div>
      <TextInput></TextInput>
    </div>
  );
}
