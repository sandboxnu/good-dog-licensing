import React from "react";

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
      <div className="flex w-full flex-row items-center justify-center gap-[24px]">
        {imageLoc === "left" && <div className="w-1/2">{image}</div>}
        <div className="flex w-1/2 flex-col gap-[24px] text-left">
          <h2 className="text-green-400 dark:text-mint-200">{headerText}</h2>
          <p className="text-body1 leading-normal text-secondary text-green-500 dark:text-mint-200">{bodyText}</p>
        </div>
        {imageLoc === "right" && <div className="w-1/2">{image}</div>}
      </div>
    </GrowOnScroll>
  );
}
