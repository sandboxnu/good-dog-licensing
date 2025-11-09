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
      <div className="flex flex-row w-full gap-[24px] justify-center items-center">
        {imageLoc === "left" && <div className="w-1/2">{image}</div>}
        <div className="w-1/2 text-left flex flex-col gap-[24px]">
          <h2>{headerText}</h2>
          <p className="text-body1 text-secondary leading-normal">{bodyText}</p>
        </div>
        {imageLoc === "right" && <div className="w-1/2">{image}</div>}
      </div>
    </GrowOnScroll>
  );
}
