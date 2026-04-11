import clsx from "clsx";
import { CONTENT_MAX_WIDTH_CLASSES } from "../PageContainer";
import OverviewAndLogoSection from "../landing-pages/general/components/OverviewAndLogoSection";
import MediaMakerAndMusicianSection from "../landing-pages/general/components/MediaMakerAndMusicianSection";
import GoodDogGoodSection from "../landing-pages/general/components/GoodDogGoodSection";
import ContributorsSection from "../landing-pages/general/components/ContributorsSection";
import FaqSection from "../landing-pages/general/components/FaqSection";
import {
  SPACING_CLASS,
  TOP_SPACING_CLASS,
} from "../landing-pages/general/GeneralLanding";

export default function About() {
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
          <OverviewAndLogoSection type="about" />
          <MediaMakerAndMusicianSection type="about" />
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
