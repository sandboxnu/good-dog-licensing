// TODO:
// Dark mode fixes

import clsx from "clsx";

import { CONTENT_MAX_WIDTH_CLASSES } from "../../PageContainer";
import ContributorsSection from "./components/ContributorsSection";
import FaqSection from "./components/FaqSection";
import GoodDogGoodSection from "./components/GoodDogGoodSection";
import MediaMakerAndMusicianSection from "./components/MediaMakerAndMusicianSection";
import OverviewAndLogoSection from "./components/OverviewAndLogoSection";
import TitleSection from "./components/TitleSection";

export const SPACING_CLASS = "gap-[72px]";
export const TOP_SPACING_CLASS = "pt-[20px] md:pt-[72px]";

export default function GeneralLanding() {
  return (
    <div
      className={clsx(
        "flex w-full flex-col items-center justify-center pb-[100px] text-center",
        SPACING_CLASS,
        TOP_SPACING_CLASS,
      )}
    >
      <div className={clsx("w-full", CONTENT_MAX_WIDTH_CLASSES.small)}>
        <div className={clsx("flex flex-col", SPACING_CLASS)}>
          <TitleSection />
          <OverviewAndLogoSection type="landing" />
          <MediaMakerAndMusicianSection type="landing" />
          <GoodDogGoodSection />
        </div>
      </div>

      <ContributorsSection />

      <div className={clsx("w-full", CONTENT_MAX_WIDTH_CLASSES.small)}>
        <FaqSection />
      </div>
    </div>
  );
}
