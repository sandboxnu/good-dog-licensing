import TitleSection from "./components/TitleSection";
import OverviewAndLogoSection from "./components/OverviewAndLogoSection";
import MediaMakerAndMusicianSection from "./components/MediaMakerAndMusicianSection";
import GoodDogGoodSection from "./components/GoodDogGoodSection";
import ContributorsSection from "./components/ContributorsSection";
import FaqSection from "./components/FaqSection";
import clsx from "clsx";
import { CONTENT_MAX_WIDTH_CLASSES } from "../../PageContainer";

export default function GeneralLanding() {
  return (
    <div className="flex flex-col items-center justify-center pb-[100px] text-center">
      <div className={clsx(CONTENT_MAX_WIDTH_CLASSES.small)}>
        <TitleSection />
        <OverviewAndLogoSection />
        <MediaMakerAndMusicianSection />
        <GoodDogGoodSection />
      </div>

      <ContributorsSection />

      <div className={clsx(CONTENT_MAX_WIDTH_CLASSES.small)}>
        <FaqSection />
      </div>
    </div>
  );
}
