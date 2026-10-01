import clsx from "clsx";

import { CONTENT_MAX_WIDTH_CLASSES } from "../../../PageContainer";
import GreenOval from "../../../svg/GreenOval";
import Footnote from "./Footnote";

export default function ContributorsSection() {
  return (
    <GreenOval className="flex items-center justify-center">
      <div className={clsx(CONTENT_MAX_WIDTH_CLASSES.small)}>
        <div className="relative pt-[120px] pb-[120px]">
          <div className="py-[50px] md:py-0">
            <h2 className="text-left text-[35px] leading-[96%] font-medium text-mint-200 not-italic md:text-[48px]">
              Our contributors
            </h2>
            <p className="text-left text-[18px] leading-normal font-normal text-gray-100 not-italic md:text-[20px]">
              Discover the people driving our platform, uniting strategy,
              creativity, and music.
            </p>

            <div className="mt-[36px] flex flex-col gap-[56px] md:flex-row">
              <div className="flex flex-1 flex-col items-center gap-[10px] self-stretch rounded-[24px] border border-cream-400 bg-cream-100 p-[24px] shadow-card-light dark:border-cream-600 dark:bg-green-600 dark:shadow-[0_2px_6px_0_#2E2E2E]">
                <div className="h-[250px] w-[250px] overflow-hidden rounded-[136px] shadow-[0_2px_6px_0_#BFBCB8]">
                  <img
                    src="/images/profHeadshot.png"
                    alt="Founder"
                    className="h-[250px] w-[250px] shadow-[0_2px_6px_0_#BFBCB8]"
                  />
                </div>
                <div className="mt-[8px] text-center text-[35px] leading-[104%] font-medium text-green-400 not-italic md:text-[40px] dark:text-mint-200">
                  Founder
                </div>
                <div className="mt-[16px] text-left text-[18px] leading-[128%] font-medium wrap-break-word text-dark-gray-500 not-italic md:text-[18px] dark:text-gray-300">
                  Professor Herlihy is a professor in both the College of Arts,
                  Media, and Design at Northeastern, and at the Law School, runs
                  his own entertainment law practice, and frequently writes and
                  records original music. Students in Professor Herlihy's Music
                  Licensing for Media course work with Good Dog Licensing
                  throughout the semester, gaining hands-on experience in A&R,
                  Music Supervisions
                  <Footnote
                    number={5}
                    tooltip="Music supervision is the art of selecting and licensing preexisting songs or recordings for use in visual media like film, television, video games, and advertising."
                  />
                  , and Music Licensing.
                </div>
              </div>
              <div className="flex flex-1 flex-col items-center gap-[10px] self-stretch rounded-[24px] border border-cream-400 bg-cream-100 p-[24px] shadow-card-light dark:border-cream-600 dark:bg-green-600 dark:shadow-[0_2px_6px_0_#2E2E2E]">
                <div className="flex h-[250px] w-[250px] flex-col items-center justify-center overflow-hidden rounded-[136px] shadow-[0_2px_6px_0_#BFBCB8] dark:bg-mint-300">
                  <img
                    src="/images/greenLineRecords.png"
                    alt="Green Line Records"
                    className="h-[178.6px] w-[224px]"
                  />
                </div>
                <div className="mt-[8px] text-center text-[35px] leading-[104%] font-medium text-green-400 not-italic md:text-[40px] dark:text-mint-200">
                  Green Line Records
                </div>
                <div className="mt-[16px] text-left text-[18px] leading-[128%] font-medium wrap-break-word text-dark-gray-500 not-italic md:text-[20px] dark:text-gray-300">
                  Green Line Records is Northeastern University's student-run
                  record label. Green Line Records aims to showcase Boston's
                  music scene by offering their artists a full range of services
                  within A&R, Recording, Events, and Creative Services
                  departments. Good Dog Licensing operates as Green Line
                  Record's licensing department, offering musicians and media
                  makers the chance to connect with Green Line Record and
                  utilize their services.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GreenOval>
  );
}
