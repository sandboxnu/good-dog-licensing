"use client";

import { useRouter } from "next/navigation";
import Button from "../../../base/Button";
import WomanInComputer from "../../../svg/homepage/WomanInComputer";
import ManWithSax from "../../../svg/homepage/ManWithSax";
import Footnote from "./Footnote";

export default function MediaMakerAndMusicianSection() {
  const router = useRouter();

  return (
    <>
      <div className="text-left">
        <h3 className="mt-[72px] text-[28px] font-medium leading-[96%] dark:text-mint-300 md:text-[48px]">
          Our mission and vision.{" "}
          <span className="text-green-400 dark:text-mint-200">
            Connecting Creatives.
          </span>
        </h3>
        <h3 className="mt-[8px] text-[16px] font-normal leading-[128%] text-green-500 dark:text-mint-200 md:text-[20px]">
          Discover how our platform connects creators, simplifies licensing, and
          ensures fair collaboration for everyone involved.
        </h3>
      </div>

      <div className="mt-[36px] flex flex-col gap-[56px] md:flex-row">
        <div className="flex flex-1 flex-col items-center self-stretch overflow-hidden rounded-[24px] border border-[#ECE6DF] bg-cream-100 px-[24px] py-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#403F3E] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#171717]">
          <div className="flex items-center justify-center">
            <WomanInComputer />
          </div>
          <h3 className="mt-[8px] text-center text-[28px] font-medium not-italic leading-[104%] text-green-400 dark:text-mint-200 md:text-[40px]">
            Sign up as a Media Maker
          </h3>
          <p className="mt-[16px] w-full break-words text-center text-[16px] font-normal not-italic leading-[128%] text-green-500 dark:text-mint-200 md:text-[20px]">
            Submit a description of your project and the type of music you're
            looking for. Good Dog takes care of everything and at no cost to
            you.
          </p>
          <div className="mt-[16px]">
            <Button
              label="Sign up now"
              size="large"
              variant="outlined"
              onClick={() => router.push("/signup")}
              shadow
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center self-stretch overflow-hidden rounded-[24px] border border-[#ECE6DF] bg-cream-100 px-[24px] py-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#403F3E] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#171717]">
          <div className="flex items-center justify-center">
            <ManWithSax />
          </div>
          <h3 className="mt-[8px] text-center text-[28px] font-medium not-italic leading-[104%] text-green-400 dark:text-mint-200 md:text-[40px]">
            Sign up as a Musician
          </h3>
          <p className="mt-[16px] w-full break-words text-center text-[16px] font-normal not-italic leading-[128%] text-green-500 dark:text-mint-200 md:text-[20px]">
            Submit your music{" "}
            <Footnote
              number={3}
              tooltip="Music contains two copyrightable works: the Sound Recording (The actual recorded sounds), and the underlying Musical Work (the composition, melody, and lyrics)."
            />{" "}
            to our extensive catalog – we're open to all genres and styles.
            You'll be notified when media makers want to place your music in
            their projects!
          </p>
          <div className="mt-[16px]">
            <Button
              label="Sign up now"
              size="large"
              variant="outlined"
              onClick={() => router.push("/signup")}
              shadow
            />
          </div>
        </div>
      </div>
    </>
  );
}
