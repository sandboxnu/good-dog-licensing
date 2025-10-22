"use client";
import React from "react";
import { Button } from "@good-dog/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center items-center min-h-screen pt-[32px] pb-[32px]">
      <div className="flex flex-col w-full gap-[144px] justify-center items-center">
        <div className="flex flex-col justify-center text-center gap-[37px]">
          <div className="pt-[32px]">
            <h1>Connecting musicians and media makers</h1>
          </div>
          <div className="flex flex-col gap-[64px]">
            <div className="flex flex-col gap-[24px] text-body-primary">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco{" "}
              </p>

              <div className="flex gap-4 justify-center">
                <Button
                  size="large-text"
                  className="bg-dark-green text-off-white shadow-button"
                  onClick={() => router.push("/login")}
                >
                  Get started
                </Button>
                <Button
                  size="large-text"
                  variant="outlined"
                  className="shadow-button"
                  onClick={() => router.push("/about")}
                >
                  Learn more
                </Button>
              </div>
            </div>

            <div className="w-full h-[500px] bg-gray-400 shadow-div rounded-[20px]"></div>
          </div>
        </div>
        <LearnMoreAboutRoles />
      </div>
    </div>
  );
}
function LearnMoreAboutRoles() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-[48px]">
      <div className="flex flex-row gap-[24px]">
        <h2 className="w-1/2 leading-none">Learn more about different roles</h2>
        <p className="w-1/2">
          Lorem ipsum is placeholder text commonly used in the graphic, print,
          and publishing industries for previewing layouts and visual mockups.
        </p>
      </div>
      <div className="flex flex-row gap-[48px]">
        <VerticalDescriptionSection
          title="Become a Media Maker"
          text="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
          link={() => router.push("/signup/media-maker")}
          linkText="Sign up as a media maker →"
        />
        <VerticalDescriptionSection
          title="Become a Musician"
          text="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
          link={() => router.push("/signup/musician")}
          linkText="Sign up as a musician →"
        />
      </div>
      <DescriptionSection
        order="text-left"
        title="Get the music you need!"
        text="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
      />
      <DescriptionSection
        order="text-right"
        title="Build your brand!"
        text="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
      />
      <DescriptionSection
        order="text-left"
        title="Our partners"
        text="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
      />
    </div>
  );
}

export function DescriptionSection({
  order,
  title,
  text,
}: {
  order: "text-right" | "text-left";
  title: string;
  text: string;
}) {
  return (
    <div
      className={`flex gap-[24px] ${order == "text-left" ? "flex-row" : "flex-row-reverse"} items-center`}
    >
      <div className="flex flex-col gap-[24px] w-1/2">
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="flex w-1/2 items-center justify-center">
        <SampleImage />
      </div>
    </div>
  );
}

function VerticalDescriptionSection({
  title,
  text,
  link,
  linkText,
}: {
  title: string;
  text: string;
  link: () => void;
  linkText: string;
}) {
  //const router = useRouter();

  return (
    <div className="flex flex-col gap-[24px] text-center justify-center items-center">
      <SampleImage />
      <h2 className="">{title}</h2>
      <p>{text}</p>
      <Button variant={"text"} onClick={link}>
        {linkText}
      </Button>
    </div>
  );
}

function SampleImage() {
  return <div className="w-[250px] h-[250px] bg-gray-400 rounded-[20px]"></div>;
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
