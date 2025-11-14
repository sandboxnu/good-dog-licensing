"use client";

import type { ReactNode } from "react";
import React from "react";
import { useRouter } from "next/navigation";

import GrowOnScroll from "@good-dog/components/motion/GrowOnScroll";
import CoupleWithGuitar from "@good-dog/components/svg/homepage/CoupleWithGuitar";
import ManWithSax from "@good-dog/components/svg/homepage/ManWithSax";
import MusicStudio from "@good-dog/components/svg/homepage/MusicStudio";
import PuzzleBuilding from "@good-dog/components/svg/homepage/PuzzleBuilding";
import WomanInComputer from "@good-dog/components/svg/homepage/WomanInComputer";
import { Button } from "@good-dog/ui/button";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center pb-[32px]">
      <div className="flex w-full flex-col items-center justify-center gap-[144px]">
        <div className="flex flex-col justify-center gap-[37px] text-center">
          <div className="pt-[32px]">
            <h1 className="font-righteous text-[75px] font-normal not-italic leading-[80px] text-body-primary">
              Connecting musicians and media makers
            </h1>
          </div>
          <div className="flex flex-col gap-[64px]">
            <div className="flex flex-col gap-[24px] text-body-primary">
              <p className="text-body1 leading-normal">
                {
                  "Northeastern University's student-run music synchronization service"
                }
              </p>

              <div className="flex justify-center gap-4">
                <Button
                  size="large-text"
                  className="bg-good-dog-main text-off-white shadow-button"
                  onClick={() => router.push("/signup")}
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

            <div className="h-[500px] w-full rounded-[20px] bg-gray-400 shadow-div"></div>
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
        <p className="w-1/2 text-body1 leading-normal text-secondary">
          Lorem ipsum is placeholder text commonly used in the graphic, print,
          and publishing industries for previewing layouts and visual mockups.
        </p>
      </div>
      <div className="overflow-wrap flex flex-row gap-[48px]">
        <div className="w-1/2">
          <VerticalDescriptionSection
            title="Become a Media Maker"
            text="Submit a description of your project and the type of music you’re looking for. Good Dog takes care of everything and at no cost to you. Tell us what you need, we will source the music for you, and utilize our original licensing agreement."
            link={() => router.push("/signup/media-maker")}
            linkText="Sign up as a media maker →"
            image={<WomanInComputer />}
          />
        </div>
        <div className="w-1/2">
          <VerticalDescriptionSection
            title="Become a Musician"
            text="Submit your music to our extensive catalog – we’re open to all genres and styles. You’ll be notified when media makers want to place your music in their projects! You can say no to any synch placement-but you should say “Yes!” GDL will never license your music without your permission."
            link={() => router.push("/signup/musician")}
            linkText="Sign up as a musician →"
            image={<ManWithSax />}
          />
        </div>
      </div>
      <DescriptionSection
        order="text-left"
        title="Get the music you need!"
        text="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
        image={<CoupleWithGuitar />}
      />
      <DescriptionSection
        order="text-right"
        title="Build your brand!"
        text="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
        image={<PuzzleBuilding />}
      />
      <DescriptionSection
        order="text-left"
        title="Our partners"
        text="GDL is currently working directly with media producers and independent musicians to license music into media projects. Sandbox, Northeastern's student-led software consultancy, is developing an enterprise application so GDL can grow into a large-scale music licensing solution for creatives."
        image={<MusicStudio />}
      />
    </div>
  );
}

export function DescriptionSection({
  order,
  title,
  text,
  image,
}: {
  order: "text-right" | "text-left";
  title: string;
  text: string;
  image: ReactNode;
}) {
  return (
    <GrowOnScroll>
      <div
        className={`flex gap-[24px] ${order == "text-left" ? "flex-row" : "flex-row-reverse"} items-center`}
      >
        <div className="flex w-1/2 flex-col gap-[24px]">
          <h2>{title}</h2>
          <p className="text-body1 leading-normal text-secondary">{text}</p>
        </div>
        <div className="flex w-1/2 items-center justify-center">{image}</div>
      </div>
    </GrowOnScroll>
  );
}

export function VerticalDescriptionSection({
  title,
  text,
  link,
  linkText,
  image,
}: {
  title: string;
  text: string;
  link: () => void;
  linkText: string;
  image: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-[24px] text-justify">
      {image}
      <h2>{title}</h2>
      <p className="text-body1 leading-normal text-secondary">{text}</p>
      <Button variant={"text"} onClick={link}>
        {linkText}
      </Button>
    </div>
  );
}
