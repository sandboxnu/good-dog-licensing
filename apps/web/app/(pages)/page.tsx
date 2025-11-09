"use client";

import type { ReactNode } from "react";
import React from "react";
import { useRouter } from "next/navigation";

import GrowOnScroll from "@good-dog/components/motion/GrowOnScroll";
import PageContainer from "@good-dog/components/PageContainer";
import CoupleWithGuitar from "@good-dog/components/svg/homepage/CoupleWithGuitar";
import ManWithSax from "@good-dog/components/svg/homepage/ManWithSax";
import MusicStudio from "@good-dog/components/svg/homepage/MusicStudio";
import PuzzleBuilding from "@good-dog/components/svg/homepage/PuzzleBuilding";
import WomanInComputer from "@good-dog/components/svg/homepage/WomanInComputer";
import { Button } from "@good-dog/ui/button";

export default function Home() {
  const router = useRouter();
  return (
    <PageContainer background="gradient">
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco{" "}
                </p>

                <div className="flex justify-center gap-4">
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

              <div className="h-[500px] w-full rounded-[20px] bg-gray-400 shadow-div"></div>
            </div>
          </div>
          <LearnMoreAboutRoles />
        </div>
      </div>
    </PageContainer>
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
        <VerticalDescriptionSection
          title="Become a Media Maker"
          text="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
          link={() => router.push("/signup/media-maker")}
          linkText="Sign up as a media maker →"
          image={<WomanInComputer />}
        />
        <VerticalDescriptionSection
          title="Become a Musician"
          text="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
          link={() => router.push("/signup/musician")}
          linkText="Sign up as a musician →"
          image={<ManWithSax />}
        />
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
        text="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
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
    <div className="flex flex-col items-center justify-center gap-[24px] text-center">
      {image}
      <h2>{title}</h2>
      <p className="text-body1 leading-normal text-secondary">{text}</p>
      <Button variant={"text"} onClick={link}>
        {linkText}
      </Button>
    </div>
  );
}
