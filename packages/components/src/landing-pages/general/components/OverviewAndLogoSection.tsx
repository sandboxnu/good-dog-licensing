"use client";

import { useRouter } from "next/navigation";

import Button from "../../../base/Button";
import LandingLogo from "../../../svg/homepage/LandingLogo";
import Footnote from "./Footnote";
import type { LandingComponentProps } from "./types";

export default function OverviewAndLogoSection({
  type,
}: LandingComponentProps) {
  const router = useRouter();
  const isAbout = type === "about";

  return (
    <div className="flex w-full justify-center">
      <div
        className={`flex w-full max-w-[450px] flex-col-reverse items-center gap-[20px] rounded-[24px] md:max-w-none md:flex-row md:gap-[40px] ${
          isAbout
            ? ""
            : "p-[24px] md:px-[32px] lg:px-[48px] shadow-card-light dark:shadow-card-dark border border-cream-400 bg-cream-100 dark:border-cream-600 dark:bg-green-600"
        }`}
      >
        <div
          className={`flex min-w-0 flex-col items-center justify-center text-left lg:items-start ${
            isAbout ? "w-2/3" : "lg:w-1/2 w-full"
          }`}
        >
          <h3 className="w-full text-[35px] font-normal dark:text-mint-300 md:text-[48px]">
            Good Dog Licensing
          </h3>
          <p className="mt-[8px] w-full break-words text-[18px] font-medium leading-[128%] dark:text-gray-300 md:text-[20px]">
            Good Dog Licensing connects creatives by providing a legal framework
            for media producers to source high quality music from independent
            artists
            <Footnote
              number={1}
              tooltip="Good Dog artists are independent, meaning they have not signed with a Record Label or Music Publisher and own 100% of the copyright to both the Sound Recording and Musical Composition."
            />{" "}
            for their media projects. Good Dog Licensing connects independent
            media makers
            <Footnote
              number={2}
              tooltip="A Media Maker is anyone who needs music for their audiovisual project. This could be social media content, short films, podcast intros and much more."
            />{" "}
            with independent musicians to enhance media projects and help
            musicians grow their audiences – all for free!
          </p>
          {!isAbout && (
            <div className="mt-[32px] w-full">
              <Button
                onClick={() => router.push("/signup")}
                label="Get Started"
                size="large"
                variant="contained"
                shadow
                fullWidth
              />
            </div>
          )}
        </div>
        <div
          className={`flex flex-shrink-0 items-center justify-center ${
            isAbout ? "w-1/3" : "w-1/2"
          }`}
        >
          <LandingLogo />
        </div>
      </div>
    </div>
  );
}
