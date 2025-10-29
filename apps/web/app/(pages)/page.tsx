"use client";
import type { ReactNode } from "react";
import React from "react";
import { Button } from "@good-dog/ui/button";
import { useRouter } from "next/navigation";
import WomanInComputer from "@good-dog/components/svg/homepage/WomanInComputer";
import ManWithSax from "@good-dog/components/svg/homepage/ManWithSax";
import CoupleWithGuitar from "@good-dog/components/svg/homepage/CoupleWithGuitar";
import PuzzleBuilding from "@good-dog/components/svg/homepage/PuzzleBuilding";
import MusicStudio from "@good-dog/components/svg/homepage/MusicStudio";

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
                  className="bg-good-dog-main text-off-white shadow-button"
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
      <div className="flex flex-row overflow-wrap gap-[48px]">
        <VerticalDescriptionSection
          title="Become a Media Maker"
          text="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
          link={() => router.push("/signup/media-maker")}
          linkText="Sign up as a media maker →"
          image={<WomanInComputer/>}
        />
        <VerticalDescriptionSection
          title="Become a Musician"
          text="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
          link={() => router.push("/signup/musician")}
          linkText="Sign up as a musician →"
                    image={<ManWithSax/>}

        />
      </div>
      <DescriptionSection
        order="text-left"
        title="Get the music you need!"
        text="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
        image={<CoupleWithGuitar/>}
      />
      <DescriptionSection
        order="text-right"
        title="Build your brand!"
        text="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
                image={<PuzzleBuilding/>}

     />
      <DescriptionSection
        order="text-left"
        title="Our partners"
        text="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
             image={<MusicStudio/>}

     />
    </div>
  );
}

export function DescriptionSection({
  order,
  title,
  text,
  image
}: {
  order: "text-right" | "text-left";
  title: string;
  text: string;
  image: ReactNode;
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
        {image}
      </div>
    </div>
  );
}

export function VerticalDescriptionSection({
  title,
  text,
  link,
  linkText,
  image
}: {
  title: string;
  text: string;
  link: () => void;
  linkText: string;
  image: ReactNode
}) {
  return (
    <div className="flex flex-col gap-[24px] text-center justify-center items-center">
      {image}
      <h2 className="">{title}</h2>
      <p>{text}</p>
      <Button variant={"text"} onClick={link}>
        {linkText}
      </Button>
    </div>
  );
}