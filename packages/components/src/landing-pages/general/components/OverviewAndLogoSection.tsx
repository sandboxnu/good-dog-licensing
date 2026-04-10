"use client";

import { useRouter } from "next/navigation";

import Button from "../../../base/Button";
import LandingLogo from "../../../svg/homepage/LandingLogo";
import Footnote from "./Footnote";

export default function OverviewAndLogoSection() {
  const router = useRouter();

  return (
    <div className="mt-[80px] flex w-full flex-col-reverse gap-[40px] rounded-[24px] border border-[#ECE6DF] bg-cream-100 px-[24px] py-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#403F3E] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#171717] md:flex-row md:px-[48px]">
      <div className="flex min-w-0 flex-col items-center justify-center text-left md:items-start">
        <h3 className="text-[28px] font-normal dark:text-mint-300 md:text-[48px]">
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
      <div className="flex w-full flex-shrink-0 items-center justify-center md:h-[464px] md:w-[464px]">
        <LandingLogo />
      </div>
    </div>
  );
}
