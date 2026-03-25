"use client";

import { DictionaryWord } from "../base/DictionaryWord";
import DownArrow from "../svg/DownArrow";
import Button from "../base/Button";
import Footnote from "../base/Footnote";
import { useRouter } from "next/navigation";

import GrowOnScroll from "@good-dog/components/motion/GrowOnScroll";
import ManWithSax from "@good-dog/components/svg/homepage/ManWithSax";
import WomanInComputer from "@good-dog/components/svg/homepage/WomanInComputer";

import Check from "../svg/homepage/Check";
import LandingLogo from "../svg/homepage/LandingLogo";
import ThinkingPerson from "../svg/homepage/ThinkingPerson";
import GreenOval from "../svg/GreenOval";
import Accordion from "./components/Accordion";

// new background "spotted gradient"
// new header with dark mode toggle
// add space before superscripts (in figma)
// one footnote opens at a time
// one accordion opens at a time
// fix logo size in first card
// put in footnotes
// dark mode fixes: down arrow, white cards, buttons, footnotes, check marks
// fix shadows on white cards (they're funky)
// fix wrapping on check mark cards
// add ovals
// padding at very bottom of page?

// END: move to general landing page

export default function FaqLanding() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center">
        <div className="flex flex-col justify-center text-center">
          <h1 className="pt-[64px] font-righteous text-[72px] font-normal leading-[80px] text-body-primary text-dark-gray-500 dark:text-mint-300">
            Connecting musicians and media makers
          </h1>
          <p className="mt-[16px] text-[35px] font-medium leading-[104%] text-center text-dark-gray-500 dark:text-gray-300">
            Northeastern University's free, student-run music synchronization
            service.
          </p>
          <h2 className="mt-[40px] text-[48px] font-medium leading-[96%] text-center text-green-400 dark:text-mint-200">
            Say "Yes" to Licensing!
          </h2>
          <div className="mt-[16] flex items-center justify-center">
            <DownArrow />
          </div>

          <div className="bg-cream-100 w-full rounded-[24px] px-[48px] py-[24px] flex flex-row shadow-[0_2px_6px_0] shadow-cream-400 mt-[80px] gap-[40px]">
            <div className="flex flex-col text-left items-center justify-center">
              <h3 className="text-[48px] font-normal dark:text-mint-300">
                Good Dog Licensing
              </h3>
              <p className="mt-[8px] text-[18px] font-medium leading-[128%] w-[392px] dark:text-gray-300">
                Good Dog Licensing connects creatives by providing a legal
                framework for media producers to source high quality music from
                independent artists
                <Footnote number={1} tooltip="Footnote text" /> for their media
                projects. Good Dog Licensing connects independent media makers
                <Footnote number={2} tooltip="Footnote text" /> with independent
                musicians to enhance media projects and help musicians grow
                their audiences – all for free!
              </p>
              <div className="mt-[32px] w-[392px]">
                <Button
                  onClick={() => router.push("/signup")}
                  label="Get Started"
                  size="large"
                  variant="contained"
                  shadow
                  fullWidth
                />
              </div>
            </div>
            <div className="flex h-[464px] w-[464px] flex-shrink-0 items-center justify-center">
              <LandingLogo />
            </div>
          </div>

          <div className="text-left">
            <h3 className="mt-[72px] text-[48px] font-medium leading-[96%] dark:text-mint-300">
              Our mission and vision.{" "}
              <span className="text-green-400 dark:text-mint-200">
                Connecting Creatives.
              </span>
            </h3>
            <h3 className="mt-[8px] text-[20px] font-normal leading-[128%] text-green-500 dark:text-mint-200">
              Discover how our platform connects creators, simplifies licensing,
              and ensures fair collaboration for everyone involved.
            </h3>
          </div>

          <div className="mt-[36px] flex gap-[56px]">
            <div className="flex flex-1 flex-col items-center self-stretch overflow-hidden rounded-[24px] shadow-[0_2px_6px_0] shadow-cream-400 border-cream-400 bg-cream-100 px-[24px] py-[24px]">
              <div className="flex items-center justify-center">
                <WomanInComputer />
              </div>
              <h3 className="mt-[8px] text-[40px] font-medium not-italic leading-[104%] text-center text-green-400 dark:text-mint-200">
                Sign up as a Media Maker
              </h3>
              <p className="mt-[16px] w-[360px] text-[20px] font-normal not-italic leading-[128%] text-center text-green-500 dark:text-mint-200">
                Submit a description of your project and the type of music
                you're looking for. Good Dog takes care of everything and at no
                cost to you.
              </p>
              <div className="mt-[16px]">
                <button
                  onClick={() => router.push("/signup")}
                  className="flex h-[48px] items-center justify-center gap-[8px] rounded-[8px] border-[0.5px] border-[#404040] bg-cream-100 px-[24px] shadow-[4px_4px_0_0_#000]"
                >
                  Sign up now
                </button>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center self-stretch overflow-hidden rounded-[24px] shadow-[0_2px_6px_0] shadow-cream-400 border-cream-400 bg-cream-100 px-[24px] py-[24px]">
              <div className="flex items-center justify-center">
                <ManWithSax />
              </div>
              <h3 className="mt-[8px] text-[40px] font-medium not-italic leading-[104%] text-center text-green-400 dark:text-mint-200">
                Sign up as a Musician
              </h3>
              <p className="mt-[16px] w-[360px] self-center text-[20px] font-normal not-italic leading-[128%] text-center text-green-500 dark:text-mint-200">
                Submit your music{" "}
                <Footnote number={3} tooltip="Footnote text" /> to our extensive
                catalog – we’re open to all genres and styles. You’ll be
                notified when media makers want to place your music in their
                projects!
              </p>
              <div className="mt-[16px]">
                <button
                  onClick={() => router.push("/signup")}
                  className="flex h-[48px] items-center justify-center gap-[8px] rounded-[8px] border-[0.5px] border-[#404040] bg-cream-100 px-[24px] shadow-[4px_4px_0_0_#000]"
                >
                  Sign up now
                </button>
              </div>
            </div>
          </div>

          <div className="mt-[72px] flex flex-col">
            <div className="text-left">
              <h3 className="text-[48px] font-medium not-italic leading-[96%] text-dark-gray-500 dark:text-mint-300">
                What makes Good Dog{" "}
                <span className="text-green-400 dark:text-mint-200">
                  "Good"?
                </span>
              </h3>
              <p className="mt-[8px] text-[20px] font-normal not-italic leading-[128%] text-dark-gray-500 dark:text-gray-300">
                We are not in it for the money. REALLY. 
              </p>
            </div>
            <div className="mt-[36px] flex flex-row gap-[32px]">
              <div className="flex items-center">
                <ThinkingPerson />
              </div>

              <div className="flex flex-1 flex-row gap-[8px]">
                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
                    <div className="h-[24px] w-[24px] flex-shrink-0">
                      <Check />
                    </div>
                    <p className="flex-1 shrink-0 text-[18px] font-medium not-italic leading-[128%] text-left text-dark-gray-500 dark:text-mint-200">
                      Artists retain 100% of their copyrights
                      <Footnote number={4} tooltip="Footnote text" />.
                    </p>
                  </div>
                  <div className="flex items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
                    <div className="h-[24px] w-[24px] flex-shrink-0">
                      <Check />
                    </div>
                    <p className="flex-1 shrink-0 text-[18px] font-medium not-italic leading-[128%] text-left text-dark-gray-500 dark:text-mint-200">
                      Artists can say no to any synch
                      <Footnote number={5} tooltip="Footnote text" /> placement
                      but you should say "Yes!"
                    </p>
                  </div>
                  <div className="flex items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
                    <div className="h-[24px] w-[24px] flex-shrink-0">
                      <Check />
                    </div>
                    <p className="flex-1 shrink-0 text-[18px] font-medium not-italic leading-[128%] text-left text-dark-gray-500 dark:text-mint-200">
                      Artists can earn public performance royalties through
                      ASCAP or BMI.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
                    <div className="h-[24px] w-[24px] flex-shrink-0">
                      <Check />
                    </div>
                    <p className="flex-1 shrink-0 text-[18px] font-medium not-italic leading-[128%] text-left text-dark-gray-500 dark:text-mint-200">
                      No up-front fee and no commission and our service is
                      non-exclusive.
                    </p>
                  </div>
                  <div className="flex items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
                    <div className="h-[24px] w-[24px] flex-shrink-0">
                      <Check />
                    </div>
                    <p className="flex-1 shrink-0 text-[18px] font-medium not-italic leading-[128%] text-left text-dark-gray-500 dark:text-mint-200">
                      We take the hassle out of finding picture-perfect music
                      for projects.
                    </p>
                  </div>
                  <div className="flex items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
                    <div className="h-[24px] w-[24px] flex-shrink-0">
                      <Check />
                    </div>
                    <p className="flex-1 shrink-0 text-[18px] font-medium not-italic leading-[128%] text-left text-dark-gray-500 dark:text-mint-200">
                      Artists receive full attribution for all uses of their
                      music.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[72px]">
            <h2 className="text-[48px] font-medium not-italic leading-[96%] text-left text-mint-200">
              Our contributors
            </h2>
            <p className="text-[20px] font-normal not-italic leading-normal text-left text-gray-100">
              Discover the people driving our platform, uniting strategy,
              creativity, and music.
            </p>

            <div className="mt-[36px] flex flex-row gap-[136px]">
              <div className="flex flex-1 flex-col items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
                <div className="h-[250px] w-[250px] overflow-hidden rounded-[136px] shadow-[0_2px_6px_0_#BFBCB8]">
                  <img
                    src="/images/profHeadshot.png"
                    alt="Founder"
                    className="h-[250px] w-[250px] shadow-[0_2px_6px_0_#BFBCB8]"
                  />
                </div>
                <div className="mt-[8px] text-[40px] font-medium not-italic leading-[104%] text-center text-green-400 dark:text-mint-200">
                  Founder
                </div>
                <div className="mt-[16px] text-[18px] font-medium not-italic leading-[128%] text-center text-dark-gray-500 dark:text-gray-300">
                  Professor Herlihy is a professor in both the College of Arts,
                  Media, and Design at Northeastern, and at the Law School, runs
                  his own entertainment law practice, and frequently writes and
                  records original music. Students in Professor Herlihy’s Music
                  Licensing for Media course work with Good Dog Licensing
                  throughout the semester, gaining hands-on experience in A&R,
                  Music Supervisions
                  <Footnote number={5} tooltip="Footnote text" />, and Music
                  Licensing.
                </div>
              </div>
              <div className="flex flex-1 flex-col items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
                <div className="h-[250px] w-[250px] flex flex-col items-center justify-center overflow-hidden rounded-[136px] shadow-[0_2px_6px_0_#BFBCB8]">
                  <img
                    src="/images/greenLineRecords.png"
                    alt="Green Line Records"
                    className="h-[188.6px] w-[234px]"
                  />
                </div>
                <div className="mt-[8px] text-[40px] font-medium not-italic leading-[104%] text-center text-green-400 dark:text-mint-200">
                  Green Line Records
                </div>
                <div className="mt-[16px] text-[18px] font-medium not-italic leading-[128%] text-center text-dark-gray-500 dark:text-gray-300">
                  Green Line Records is Northeastern University’s student-run
                  record label. Green Line Records aims to showcase Boston’s
                  music scene by offering their artists a full range of services
                  within A&R, Recording, Events, and Creative Services
                  departments. Good Dog Licensing operates as Green Line
                  Record’s licensing department, offering musicians and media
                  makers the chance to connect with Green Line Record and
                  utilize their services.
                </div>
              </div>
            </div>
          </div>

          <h3 className="mt-[72px] text-[48px] font-medium text-left not-italic leading-[96%] text-dark-gray-500 dark:text-mint-300">
            Frequently asked questions
          </h3>
          <div className="mt-[36px] flex flex-col gap-[8px]">
            <Accordion
              title={"What are PROs and why should I register?"}
              body={
                "They are Performance Rights Organizations such as BMI and ASCAP. In this case, it’s a great way to keep track of where the media that uses your song is being performed. When Media Makers submit cue sheets, they’ll do it through a PRO and then if they get paid, you’ll make royalties automatically."
              }
            />
            <Accordion
              title={
                "What if the media Good Dog wants to sync my song in isn’t my vibe?"
              }
              body={
                "It’s still a great way to reach a wider audience and get traction. But at the end of the day, if you don’t want your music in a specific project, you get the last call!"
              }
            />
            <Accordion
              title={
                "How long before I need my project done should I reach out to Good Dog?"
              }
              body={
                "It’s never too early! Reach out to us as early in the process as possible. When you’re developing a story, let’s have a conversation about the kind of music you need so we can get started. We’d love to hear about your project and ideas ASAP!"
              }
            />
            <Accordion
              title={
                "I normally just use an MP3 converter to get whatever music I need from Youtube. Why should I stop?"
              }
              body={
                "That won’t fly if you’re submitting your work to festivals or if you get offered a theatrical license. License your music properly so that your work has legs, and learn about writing music briefs/collaborating with music supervisors while you’re at it."
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
