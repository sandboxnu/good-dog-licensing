import Checklist from "../svg/onboarding/media-maker/Checklist";
import TeamworkMediaMaker from "../svg/onboarding/media-maker/TeamworkMediaMaker";
import VideoTutorial from "../svg/onboarding/media-maker/VideoTutorial";
import SectionRow from "./SectionRow";

export default function MediaMakerSection() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-[140px] pb-[200px] pt-[100px] text-center">
      <h1 className="text-green-500 dark:text-mint-200">Tell us about your project and we’ll find music that matches!</h1>
      <SectionRow
        headerText="Submit your project"
        bodyText="Fill out our brief submission form to generate a description of your project and music needs. We’ll use your brief to find music from independent artists that fits your work."
        image={<Checklist />}
        imageLoc="left"
      />
      <SectionRow
        headerText="Review your music options"
        bodyText="You’ll see potential song options through our site – give them a listen and decide which song you’d like to use. We’ll notify the artist for you."
        image={<VideoTutorial />}
        imageLoc="right"
      />
      <SectionRow
        headerText="Enjoy your license"
        bodyText="Once the artist approves the use, we’ll generate a licensing agreement. You’re free to use the music in your project!"
        image={<TeamworkMediaMaker />}
        imageLoc="left"
      />
    </div>
  );
}
