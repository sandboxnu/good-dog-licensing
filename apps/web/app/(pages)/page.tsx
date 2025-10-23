"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@good-dog/ui/button";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center pb-[32px] pt-[32px]">
      <div className="flex w-full flex-col items-center justify-center gap-[144px]">
        <div className="flex flex-col justify-center gap-[37px] text-center">
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
      <div className="flex w-1/2 flex-col gap-[24px]">
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="flex w-1/2 items-center justify-center">
        <SampleImage />
      </div>
    </div>
  );
}

export function VerticalDescriptionSection({
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
  return (
    <div className="flex flex-col items-center justify-center gap-[24px] text-center">
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
  return <div className="h-[250px] w-[250px] rounded-[20px] bg-gray-400"></div>;
}
