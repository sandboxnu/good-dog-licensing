import ChecklistMusician from "../svg/onboarding/musician/ChecklistMusician";
import EmailCampaign from "../svg/onboarding/musician/EmailCampaign";
import VideoCall from "../svg/onboarding/musician/VideoCall";
import SectionRow from "./SectionRow";

export default function MusicianSection() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-[64px] pt-[64px] pb-[96px] text-center md:gap-[140px] md:pt-[100px] md:pb-[200px]">
      <h1 className="text-[32px] text-green-500 md:text-[50px] dark:text-mint-200">
        Add your music to the Good Dog catalog for media makers to discover!
      </h1>
      <SectionRow
        headerText="Submit your music"
        bodyText="Fill out our music submission form to add your songs to the Good Dog Catalog. You’ll retain 100% of your rights while creating opportunities for your work to be placed in media projects."
        image={<ChecklistMusician />}
        imageLoc="right"
      />
      <SectionRow
        headerText="Match with projects"
        bodyText="Once your music is in the catalog, media makers can listen and request to license songs. You’ll be notified of each request and can learn about the details of the project through our site."
        image={<EmailCampaign />}
        imageLoc="left"
      />
      <SectionRow
        headerText="Approve the license"
        bodyText="We’ll never license your music without asking you first – you approve all placements. Our easy-to-understand licensing agreement guarantees that you’ll receive credit in any media project that your music appears in."
        image={<VideoCall />}
        imageLoc="right"
      />
    </div>
  );
}
