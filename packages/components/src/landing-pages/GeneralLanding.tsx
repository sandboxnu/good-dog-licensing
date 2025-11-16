"use client";

import type { ReactNode } from "react";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import GrowOnScroll from "@good-dog/components/motion/GrowOnScroll";
import ManWithSax from "@good-dog/components/svg/homepage/ManWithSax";
import WomanInComputer from "@good-dog/components/svg/homepage/WomanInComputer";

import Button from "../base/Button";
import { DictionaryWord } from "../base/DictionaryWord";
import Check from "../svg/homepage/Check";
import LandingLogo from "../svg/homepage/LandingLogo";
import ThinkingPerson from "../svg/homepage/ThinkingPerson";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center pb-[32px]">
      <div className="flex w-full flex-col items-center justify-center gap-[50px]">
        <div className="flex flex-col justify-center gap-[37px] text-center">
          <div className="pt-[32px]">
            <h1 className="font-righteous text-[75px] font-normal not-italic leading-[80px] text-body-primary">
              Connecting musicians and media makers
            </h1>
          </div>
          <div className="flex flex-col gap-[64px]">
            <div className="flex flex-col gap-[24px] text-body-primary">
              <p className="text-body1 leading-normal">
                Northeastern University's free, student-run music{" "}
                {
                  <DictionaryWord
                    word="synchronization"
                    definition="Music sync, or synchronization licensing, is the process of using a piece of recorded music in conjunction with a visual work, such as a film, TV show, social media reel, advertisement, or video game."
                  />
                }{" "}
                service
              </p>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => router.push("/signup")}
                  label="Get Started"
                  size="large"
                  variant="contained"
                  shadow
                />
              </div>
            </div>

            {/* <div className="h-[500px] w-full rounded-[20px] bg-gray-400 shadow-div"></div> */}
            <Image
              src={"/images/landingMainImage.jpg"}
              alt="Dashboard Example"
              width={1062}
              height={712}
            />
          </div>
        </div>
        <GrowOnScroll>
          <div className="flex w-full flex-row items-center gap-[40px] pt-[80px]">
            <div className="flex w-4/5 flex-col">
              <h1 className="text-dark-gray-500">Good Dog Licensing —</h1>
              <h1 className="text-green-500">now and tomorrow</h1>
              <div className="pt-[12px]">
                <p className="text-body1 font-medium leading-[128%] text-dark-gray-500">
                  {
                    "Good Dog Licensing connects creatives by providing a legal framework for media producers to source high quality music from independent artists for their media projects. Good Dog Licensing connects independent media makers with independent musicians to enhance media projects and help musicians grow their audiences – all for free!"
                  }
                </p>
              </div>
            </div>
            <LandingLogo />
          </div>
        </GrowOnScroll>
        <GrowOnScroll>
          <div className="flex w-full flex-row items-center gap-[40px] pt-[80px]">
            <div className="flex w-1/2 flex-col">
              <h1 className="text-dark-gray-500">Our mission and vision.</h1>
              <h1 className="text-green-500">Connecting Creatives.</h1>
            </div>
            <div className="w-1/2">
              <p className="text-body1 font-medium leading-[128%] text-dark-gray-500">
                {
                  "We aspire to connect media makers who need great music to enhance their storytelling and independent musicians who seek a wider audience for their music. "
                }
              </p>
            </div>
          </div>
        </GrowOnScroll>
        <div className="pt-[25px]">
          <IndividualSignUps />
        </div>
        <div className="pt-[80px]">
          <WhatMakesGoodDogGood />
        </div>
        <div className="flex flex-col gap-[125px] pb-[80px] pt-[80px]">
          <DescriptionSection
            order="text-right"
            title="Our founder"
            text="Professor Herlihy is a professor in both the College of Arts, Media, and Design at Northeastern, and at the Law School, runs his own entertainment law practice, and frequently writes and records original music. Students in Professor Herlihy’s Music Licensing for Media course work with Good Dog Licensing throughout the semester, gaining hands-on experience in A&R, Music Supervision, and Music Licensing. "
            image={
              <Image
                src={"/images/profHeadshot.png"}
                alt="Headshot"
                width={250}
                height={250}
              />
            }
          />
          <DescriptionSection
            order="text-left"
            title="Green Line Records"
            text="Green Line Records is Northeastern University’s student-run record label. Green Line Records  aims to showcase Boston’s music scene by offering their artists a full range of services within A&R, Recording, Events, and Creative Services departments. Good Dog Licensing operates as Green Line Record’s licensing department, offering musicians and media makers the chance to connect with Green Line Record and utilize their services."
            image={
              <Image
                src={"/images/greenLineRecords.png"}
                alt="Green Line Recods"
                width={310}
                height={250}
              />
            }
          />
          <DescriptionSection
            order="text-right"
            title="Sandbox"
            text="Sandbox is Northeastern's student-led software consultancy building software for Northeastern clients. We work closely with clients across Northeastern to help them best leverage computation."
            image={
              <Image
                src={"/images/sandbox.png"}
                alt="Sandbox"
                width={250}
                height={250}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}

function WhatMakesGoodDogGood() {
  return (
    <GrowOnScroll>
      <div className="flex w-full flex-col gap-[24px]">
        <h1 className="text-dark-gray-500">What makes Good Dog "Good"?</h1>
        <p className="text-body1 font-medium text-dark-gray-500">
          We are not in it for the money. REALLY.
        </p>
        <div className="flex flex-row justify-center gap-[32px]">
          <ThinkingPerson />
          <div className="flex flex-col gap-[8px]">
            <div className="flex flex-row gap-[8px]">
              <Reason reason="Artists retain 100% of their  copyrights." />
              <Reason reason="No up-front fee and no commission and our service is non-exclusive." />
            </div>
            <div className="flex flex-row gap-[8px]">
              <Reason reason="Artists can say no to any synch  placement but you should say “Yes!”" />
              <Reason reason="We take the hassle out of finding picture-perfect music for projects." />
            </div>
            <div className="flex flex-row gap-[8px]">
              <Reason reason="Artists can earn public performance royalties through ASCAP or BMI." />
              <Reason reason="Artists receive full attribution for all uses of their music." />
            </div>
          </div>
        </div>
      </div>
    </GrowOnScroll>
  );
}

function Reason({ reason }: { reason: string }) {
  return (
    <div className="flex h-[78px] w-[375px] flex-row items-center gap-[10px] rounded-[8px] border border-cream-400 bg-cream-100 p-[16px]">
      <div>
        <Check />
      </div>
      <p className="text-body1 font-medium text-dark-gray-500">{reason}</p>
    </div>
  );
}

function IndividualSignUps() {
  const router = useRouter();
  return (
    <GrowOnScroll>
      <div className="flex flex-col gap-[48px]">
        <div className="overflow-wrap flex flex-row gap-[48px]">
          <div className="w-1/2">
            <VerticalDescriptionSection
              title="Media Makers"
              text="Submit a description of your project and the type of music you’re looking for. Good Dog takes care of everything and at no cost to you. Tell us what you need, we will source the music for you, and utilize our original licensing agreement."
              link={() => router.push("/signup/media-maker")}
              linkText="Sign up as a media maker →"
              image={<WomanInComputer />}
            />
          </div>
          <div className="w-1/2">
            <VerticalDescriptionSection
              title="Musicians"
              text="Submit your music to our extensive catalog – we’re open to all genres and styles. You’ll be notified when media makers want to place your music in their projects! You can say no to any synch placement-but you should say “Yes!” GDL will never license your music without your permission."
              link={() => router.push("/signup/musician")}
              linkText="Sign up as a musician →"
              image={<ManWithSax />}
            />
          </div>
        </div>
      </div>
    </GrowOnScroll>
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
        <div className="flex w-[70%] flex-col gap-[10px]">
          <h2>{title}</h2>
          <p className="text-body1 leading-normal text-secondary">{text}</p>
        </div>
        <div className="flex w-[30%] items-center justify-center">{image}</div>
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
      <button type="button" onClick={link} className="text-body1">
        {linkText}
      </button>
    </div>
  );
}
