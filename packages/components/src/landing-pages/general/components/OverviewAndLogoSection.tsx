"use client";

import { useRouter } from "next/navigation";

import Button from "../../../base/Button";
import LandingLogo from "../../../svg/homepage/LandingLogo";
import Footnote from "./Footnote";

export default function OverviewAndLogoSection() {
  const router = useRouter();

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-[450px] flex-col-reverse items-center gap-[20px] rounded-[24px] border border-cream-400 bg-cream-100 p-[24px] shadow-card-light dark:border-cream-600 dark:bg-green-600 dark:shadow-card-dark md:max-w-none md:flex-row md:gap-[40px] md:px-[32px] lg:px-[48px]">
        <div className="flex w-full min-w-0 flex-col items-center justify-center text-left lg:w-1/2 lg:items-start">
          <h3 className="w-full text-[28px] font-normal dark:text-mint-300 md:text-[32px] lg:text-[48px]">
            Good Dog Licensing
          </h3>
          <p className="mt-[8px] w-full break-words text-[16px] font-medium leading-[128%] dark:text-gray-300 md:text-[18px]">
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
        </div>
        <div className="flex w-1/2 flex-shrink-0 items-center justify-center">
          <LandingLogo />
        </div>
      </div>
    </div>
  );
}
