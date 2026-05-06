import React from "react";

import Check from "../../../svg/homepage/Check";
import ThinkingPerson from "../../../svg/homepage/ThinkingPerson";
import Footnote from "./Footnote";

export default function GoodDogGoodSection() {
  return (
    <div className="flex flex-col">
      <div className="text-left">
        <h3 className="text-[35px] font-medium not-italic leading-[96%] text-dark-gray-500 dark:text-mint-300 md:text-[48px]">
          What makes Good Dog{" "}
          <span className="text-green-400 dark:text-mint-200">"Good"?</span>
        </h3>
        <p className="mt-[8px] text-[18px] font-normal not-italic leading-[128%] text-dark-gray-500 dark:text-gray-300 md:text-[20px]">
          We are not in it for the money. REALLY.
        </p>
      </div>
      <div className="mt-[36px] flex flex-col gap-[32px] md:flex-row">
        <div className="flex items-center justify-center md:justify-start">
          <ThinkingPerson />
        </div>
        <div className="grid auto-rows-fr grid-cols-1 gap-[8px] sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          <ReasonCard>
            Artists retain 100% of their copyrights
            <Footnote
              number={4}
              tooltip="Copyright protects original works like music and sound recordings, granting creators exclusive rights to reproduce, distribute, perform, and adapt their content."
            />
            .
          </ReasonCard>
          <ReasonCard>
            No up-front fee and no commission and our service is non-exclusive.
          </ReasonCard>
          <ReasonCard>
            Artists can say no to any synch
            <Footnote
              number={5}
              tooltip="Music sync (synchronization) is licensing recorded music for use in visual media like films, ads, or social media. This requires permission for both the sound recording and the musical composition."
            />{" "}
            placement but you should say "Yes!"
          </ReasonCard>
          <ReasonCard>
            We take the hassle out of finding picture-perfect music for
            projects.
          </ReasonCard>
          <ReasonCard>
            Artists can earn public performance royalties through ASCAP or BMI.
          </ReasonCard>
          <ReasonCard>
            Artists receive full attribution for all uses of their music.
          </ReasonCard>
        </div>
      </div>
    </div>
  );
}

function ReasonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[10px] rounded-[24px] border border-cream-400 bg-cream-100 px-[24px] py-[16px] shadow-card-light dark:border-cream-600 dark:bg-green-600 dark:shadow-card-dark">
      <div className="h-[24px] w-[24px] flex-shrink-0">
        <Check />
      </div>
      <div className="min-w-0 flex-1 break-words text-left text-[16px] font-medium not-italic leading-[128%] text-dark-gray-500 dark:text-mint-200 md:text-[18px]">
        {children}
      </div>
    </div>
  );
}
