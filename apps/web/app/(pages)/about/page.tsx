import Image from "next/image";

import MediaMusicianAbout from "@good-dog/components/oldStuff/MediaMusicianAbout";

const InitialHeader = () => {
  return (
    <div className="px-9">
      <div className="text-good-dog-celadon pt-6 font-righteous text-7xl">
        ABOUT US
      </div>
      <div className="font-afacad text-white">
        Good Dog Licensing is a student-run music licensing service operating
        out of Northeastern University. We operate for the sole purpose of
        connecting creatives. We offer media makers a chance to obtain top
        quality music for their projects at no cost. We also offer up and coming
        musicians the chance to earn synch credits and expand their audience. It
        is truly a win-win for every party. Developed by Northeastern students,
        Green Line Records, and Northeastern Professor David Herlihy, Good Dog
        Licensing is a first of its kind service harnessing the power of the
        next generation of industry executives.
      </div>
      <div className="font-afacad pt-6 text-white">
        Green Line Records is Northeastern University's student-driven record
        label. GLR aims to accelerate the careers of emerging artists by
        offering their diverse lineup of artists a full range of services
        including studio and live recording, marketing, merchandising, booking,
        and management. Good Dog is the licensing department of this record
        labels and offers musicians and media makers alike the chance to work
        with GLR and utilize their wealth of resources.
      </div>
    </div>
  );
};

const FurtherInfo = () => {
  return (
    <div className="flex flex-row pt-24">
      <div className="px-9">
        <div>
          <div className="text-good-dog-celadon pt-6 font-righteous text-4xl">
            What makes GOOD DOG "GOOD"?
          </div>
          <div className="font-afacad text-white">
            We offer all of our services 100% for free! All artists retain 100%
            of their copyrights as well! Good Dog Licensing is purely operating
            for the love of licensing incredible music for incredible pieces of
            media.
          </div>
          <div className="font-afacad pt-6 text-white">
            For musicians, synch has recently become one of the greatest ways to
            monetize your music and expand your audience. We offer a chance at
            stacking up on synch credits while not only keeping 100% of your
            rights, but also by earning the entirety of any residual payments
            earned from the placement. Good Dog is not in it for the money, but
            for the sake of helping independent artists.
          </div>
          <div className="font-afacad pt-6 text-white">
            For Media makers, getting the rights to music can be an extremely
            expensive and cumbersome process. Even finding the right music can
            be a struggle. Good Dog takes care of everything and at no cost to
            the media maker. We will assist in every part of the music
            supervision process from finding music to use, artist outreach and
            solicitation, and using our original licensing agreement the entire
            process is seamless and perfectly tailored to each party.
          </div>
        </div>
        <div>
          <div className="text-good-dog-celadon pt-12 font-righteous text-4xl">
            Connecting Creatives
          </div>
          <div className="font-afacad pt-6 text-white">
            “Connecting Creatives” means facilitating collaboration between
            Media Makers and Artists. Good Dog wants to get talented artists in
            contact with skilled media makers to create impactful
            synchronizations.
          </div>
        </div>
      </div>

      <Image
        src="/images/pianoStockImage.png"
        alt="piano image"
        width={660}
        height={472}
        style={{ width: "660px", height: "472px" }}
      />
    </div>
  );
};

export default function AboutUs() {
  return (
    <main className="bg-good-dog-violet">
      <InitialHeader />
      <FurtherInfo />
      <MediaMusicianAbout />
    </main>
  );
}
