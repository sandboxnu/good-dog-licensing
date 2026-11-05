import React from "react";
import clsx from "clsx";

import GrowOnScroll from "../motion/GrowOnScroll";

interface SectionRowProps {
  headerText: string;
  bodyText: string;
  image: React.ReactNode;
  imageLoc: "right" | "left";
}

export default function SectionRow({
  headerText,
  bodyText,
  image,
  imageLoc,
}: SectionRowProps) {
  return (
    <GrowOnScroll>
      {/* Stacks image above text on phones; side by side on larger screens */}
      <div
        className={clsx(
          "flex w-full flex-col items-center justify-center gap-[24px]",
          imageLoc === "left" ? "md:flex-row" : "md:flex-row-reverse",
        )}
      >
        <div className="w-full max-w-[360px] md:w-1/2 md:max-w-none">
          {image}
        </div>
        <div className="flex w-full flex-col gap-[16px] text-center md:w-1/2 md:gap-[24px] md:text-left">
          <h2 className="text-[28px] text-green-400 md:text-[40px] dark:text-mint-200">
            {headerText}
          </h2>
          <p className="text-body1 leading-normal text-green-500 text-secondary dark:text-mint-200">
            {bodyText}
          </p>
        </div>
      </div>
    </GrowOnScroll>
  );
}
