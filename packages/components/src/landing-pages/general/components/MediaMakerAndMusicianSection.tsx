"use client";

import { useRouter } from "next/navigation";

import type { LandingComponentProps } from "./types";
import Button from "../../../base/Button";
import ManWithSax from "../../../svg/homepage/ManWithSax";
import WomanInComputer from "../../../svg/homepage/WomanInComputer";
import Footnote from "./Footnote";

export default function MediaMakerAndMusicianSection({
  type,
}: LandingComponentProps) {
  const router = useRouter();
  const isAbout = type === "about";

  return (
    <div className="flex w-full flex-col items-center">
      <div className="text-left">
        <h3 className="text-[35px] font-medium leading-[96%] dark:text-mint-300 md:text-[48px]">
          Our mission and vision.{" "}
          <span className="text-green-400 dark:text-mint-200">
            Connecting Creatives.
          </span>
        </h3>
        <h3 className="mt-[8px] text-[18px] font-normal leading-[128%] text-green-500 dark:text-mint-200 md:text-[20px]">
          Discover how our platform connects creators, simplifies licensing, and
          ensures fair collaboration for everyone involved.
        </h3>
      </div>

      <div className="mt-[36px] flex max-w-[450px] flex-col gap-[25px] md:max-w-none md:flex-row md:gap-[56px]">
        <div className="flex flex-1 flex-col items-center self-stretch overflow-hidden rounded-[24px] border border-cream-400 bg-cream-100 px-[24px] py-[24px] shadow-card-light dark:border-cream-600 dark:bg-green-600 dark:shadow-card-dark">
          <div className="flex h-[200px] items-center justify-center">
            <WomanInComputer />
          </div>
          <h3 className="mt-[8px] text-center text-[28px] font-medium not-italic leading-[104%] text-green-400 dark:text-mint-200 md:text-[40px]">
            {isAbout ? "For Media Makers" : "Sign up as a Media Maker"}
          </h3>
          <p className="mt-[16px] w-full break-words text-center text-[16px] font-normal not-italic leading-[128%] text-green-500 dark:text-mint-200 md:text-[20px]">
            {isAbout
              ? "We aspire to connect media makers who need great music to enhance their storytelling and independent musicians who seek a wider audience for their music."
              : "Submit a description of your project and the type of music you're looking for. Good Dog takes care of everything and at no cost to you."}
          </p>
          {!isAbout && (
            <div className="mt-[16px] md:mt-auto md:pt-[16px]">
              <Button
                label="Sign up now"
                size="large"
                variant="outlined"
                onClick={() => router.push("/signup/media-maker")}
                shadow
              />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center self-stretch overflow-hidden rounded-[24px] border border-cream-400 bg-cream-100 px-[24px] py-[24px] shadow-card-light dark:border-cream-600 dark:bg-green-600 dark:shadow-card-dark">
          <div className="flex h-[200px] items-center justify-center">
            <ManWithSax />
          </div>
          <h3 className="mt-[8px] text-center text-[28px] font-medium not-italic leading-[104%] text-green-400 dark:text-mint-200 md:text-[40px]">
            {isAbout ? "For Musicians" : "Sign up as a Musician"}
          </h3>
          <p className="mt-[16px] w-full break-words text-center text-[16px] font-normal not-italic leading-[128%] text-green-500 dark:text-mint-200 md:text-[20px]">
            {isAbout ? (
              "Good Dog Licensing is currently working directly with media producers and independent musicians to license music into media projects."
            ) : (
              <>
                Submit your music{" "}
                <Footnote
                  number={3}
                  tooltip="Music contains two copyrightable works: the Sound Recording (The actual recorded sounds), and the underlying Musical Work (the composition, melody, and lyrics)."
                />{" "}
                to our extensive catalog – we're open to all genres and styles.
                You'll be notified when media makers want to place your music in
                their projects!
              </>
            )}
          </p>
          {!isAbout && (
            <div className="mt-[16px] md:mt-auto md:pt-[16px]">
              <Button
                label="Sign up now"
                size="large"
                variant="outlined"
                onClick={() => router.push("/signup/musician")}
                shadow
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
