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
//import NavLogo from "./svg/NavLogo";
import ThinkingPerson from "../svg/homepage/ThinkingPerson";
import GreenOval from "../svg/GreenOval";

// synchronized as dict?
// is overflow on glr logo meant to be hidden
// new background "spotted gradient"
// new header and footer with dark mode
// add space before superscripts and one definition at a time
// fix gaps and logo size in first card
// put in footnotes
// dark mode for everything
// fix wrapping on check mark cards
// add ovals

export default function FaqLanding() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center">
        <div className="flex flex-col justify-center text-center">
          <h1 className="pt-[64px] font-righteous text-[72px] font-normal not-italic leading-[80px] text-body-primary text-[#2E2E2E] dark:text-mint-300">
            Connecting musicians and media makers
          </h1>
          <p className="mt-[16px] font-afacad text-[35px] font-medium not-italic leading-[104%] text-center text-[#2E2E2E]">
            Northeastern University's free, student-run music synchronization
            service.
          </p>
          <h2 className="mt-[40px] font-afacad text-[48px] font-medium not-italic leading-[96%] text-center text-[#07634C]">
            Say "Yes" to Licensing!
          </h2>
          <div className="mt-[16] flex items-center justify-center">
            <DownArrow />
          </div>

          <div className="mt-[80px] flex items-center justify-center self-stretch overflow-hidden rounded-[24px] border border-[#ECE6DF] bg-[#FFFDFB] px-[48px] py-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
            <div className="flex flex-col text-left">
              <h3 className="font-afacad text-[48px] font-medium not-italic leading-[96%] text-[#2E2E2E]">
                Good Dog Licensing
              </h3>
              <p className="mt-[8px] font-afacad text-[18px] font-medium not-italic leading-[128%] text-[#2E2E2E] w-[392px]">
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
            <div className="gap-[40px]"></div>
            <div className="flex h-[464px] w-[464px] flex-shrink-0 items-center justify-center">
              <LandingLogo />
            </div>
          </div>

          <div className="text-left">
            <h3 className="mt-[72px] font-afacad text-[48px] font-medium not-italic leading-[96%] text-[#2E2E2E]">
              Our mission and vision.{" "}
              <span className="text-[#07634C]">Connecting Creatives.</span>
            </h3>
            <h3 className="mt-[8px] font-afacad text-[20px] font-normal not-italic leading-[128%] text-[#054233]">
              Discover how our platform connects creators, simplifies licensing,
              and ensures fair collaboration for everyone involved.
            </h3>
          </div>

          <div className="mt-[36px] flex gap-[56px]">
            <div className="flex flex-1 flex-col items-center self-stretch overflow-hidden rounded-[24px] border border-[#ECE6DF] bg-[#FFFDFB] px-[24px] py-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
              <div className="flex items-center justify-center">
                <WomanInComputer />
              </div>
              <h3 className="mt-[8px] font-afacad text-[40px] font-medium not-italic leading-[104%] text-center text-[#07634C]">
                Sign up as a Media Maker
              </h3>
              <p className="mt-[16px] w-[360px] font-afacad text-[20px] font-normal not-italic leading-[128%] text-center text-[#054233]">
                Submit a description of your project and the type of music
                you're looking for. Good Dog takes care of everything and at no
                cost to you.
              </p>
              <div className="mt-[16px]">
                <button
                  onClick={() => router.push("/signup")}
                  className="flex h-[48px] items-center justify-center gap-[8px] rounded-[8px] border-[0.5px] border-[#404040] bg-[#FFFDFB] px-[24px] shadow-[4px_4px_0_0_#000]"
                >
                  Sign up now
                </button>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center elf-stretch overflow-hidden rounded-[24px] border border-[#ECE6DF] bg-[#FFFDFB] px-[24px] py-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
              <div className="flex items-center justify-center">
                <ManWithSax />
              </div>
              <h3 className="mt-[8px] font-afacad text-[40px] font-medium not-italic leading-[104%] text-center text-[#07634C]">
                Sign up as a Musician
              </h3>
              <p className="mt-[16px] w-[360px] self-center font-afacad text-[20px] font-normal not-italic leading-[128%] text-center text-[#054233]">
                Submit your music{" "}
                <Footnote number={3} tooltip="Footnote text" /> to our extensive
                catalog – we’re open to all genres and styles. You’ll be
                notified when media makers want to place your music in their
                projects!
              </p>
              <div className="mt-[16px]">
                <button
                  onClick={() => router.push("/signup")}
                  className="flex h-[48px] items-center justify-center gap-[8px] rounded-[8px] border-[0.5px] border-[#404040] bg-[#FFFDFB] px-[24px] shadow-[4px_4px_0_0_#000]"
                >
                  Sign up now
                </button>
              </div>
            </div>
          </div>

          <div className="mt-[72px] flex flex-col">
            <div className="text-left">
              <h3 className="font-afacad text-[48px] font-medium not-italic leading-[96%] text-[#2E2E2E]">
                What makes Good Dog{" "}
                <span className="text-[#07634C]">"Good"?</span>
              </h3>
              <p className="mt-[8px] font-afacad text-[20px] font-normal not-italic leading-[128%] text-[#2E2E2E]">
                We are not in it for the money. REALLY. 
              </p>
            </div>
            <div className="mt-[36px] flex flex-row gap-[32px]">
              <div className="flex items-center">
                <ThinkingPerson />
              </div>

              <div className="flex flex-1 flex-row gap-[8px]">
                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-[#FFFDFB] p-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
                    <div className="h-[24px] w-[24px] flex-shrink-0">
                      <Check />
                    </div>
                    <p className="flex-1 shrink-0 font-afacad text-[18px] font-medium not-italic leading-[128%] text-left text-[#2E2E2E]">
                      Artists retain 100% of their copyrights
                      <Footnote number={4} tooltip="Footnote text" />.
                    </p>
                  </div>
                  <div className="flex items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-[#FFFDFB] p-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
                    <div className="h-[24px] w-[24px] flex-shrink-0">
                      <Check />
                    </div>
                    <p className="flex-1 shrink-0 font-afacad text-[18px] font-medium not-italic leading-[128%] text-left text-[#2E2E2E]">
                      Artists can say no to any synch
                      <Footnote number={5} tooltip="Footnote text" /> placement
                      but you should say "Yes!"
                    </p>
                  </div>
                  <div className="flex items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-[#FFFDFB] p-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
                    <div className="h-[24px] w-[24px] flex-shrink-0">
                      <Check />
                    </div>
                    <p className="flex-1 shrink-0 font-afacad text-[18px] font-medium not-italic leading-[128%] text-left text-[#2E2E2E]">
                      Artists can earn public performance royalties through
                      ASCAP or BMI.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-[#FFFDFB] p-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
                    <div className="h-[24px] w-[24px] flex-shrink-0">
                      <Check />
                    </div>
                    <p className="flex-1 shrink-0 font-afacad text-[18px] font-medium not-italic leading-[128%] text-left text-[#2E2E2E]">
                      No up-front fee and no commission and our service is
                      non-exclusive.
                    </p>
                  </div>
                  <div className="flex items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-[#FFFDFB] p-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
                    <div className="h-[24px] w-[24px] flex-shrink-0">
                      <Check />
                    </div>
                    <p className="flex-1 shrink-0 font-afacad text-[18px] font-medium not-italic leading-[128%] text-left text-[#2E2E2E]">
                      We take the hassle out of finding picture-perfect music
                      for projects.
                    </p>
                  </div>
                  <div className="flex items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-[#FFFDFB] p-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
                    <div className="h-[24px] w-[24px] flex-shrink-0">
                      <Check />
                    </div>
                    <p className="flex-1 shrink-0 font-afacad text-[18px] font-medium not-italic leading-[128%] text-left text-[#2E2E2E]">
                      Artists receive full attribution for all uses of their
                      music.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[72px] py-[24px]">
            <h2 className="font-afacad text-[48px] font-medium not-italic leading-[96%] text-left text-[#E9F9F1]">
              Our contributors
            </h2>
            <p className="font-afacad text-[20px] font-normal not-italic leading-normal text-left text-white">
              Discover the people driving our platform, uniting strategy,
              creativity, and music.
            </p>

            <div className="mt-[36px] flex flex-row gap-[136px]">
              <div className="flex flex-1 flex-col items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-[#FFFDFB] p-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
                <div className="h-[250px] w-[250px] overflow-hidden rounded-[136px] shadow-[0_2px_6px_0_#BFBCB8]">
                  <img
                    src="/images/profHeadshot.png"
                    alt="Founder"
                    className="h-[250px] w-[250px] shadow-[0_2px_6px_0_#BFBCB8]"
                  />
                </div>
                <div className="mt-[8px] font-afacad text-[40px] font-medium not-italic leading-[104%] text-center text-[#07634C]">
                  Founder
                </div>
                <div className="mt-[16px] font-afacad text-[18px] font-medium not-italic leading-[128%] text-center text-[#2E2E2E]">
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
              <div className="flex flex-1 flex-col items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-[#FFFDFB] p-[24px] shadow-[0_2px_6px_0_#ECE6DF]">
                <div className="h-[250px] w-[250px] flex flex-col items-center justify-center rounded-[136px] shadow-[0_2px_6px_0_#BFBCB8]">
                  <img
                    src="/images/greenLineRecords.png"
                    alt="Green Line Records"
                    className="h-[188.6px] w-[234px]"
                  />
                </div>
                <div className="mt-[8px] font-afacad text-[40px] font-medium not-italic leading-[104%] text-center text-[#07634C]">
                  Green Line Records
                </div>
                <div className="mt-[16px] font-afacad text-[18px] font-medium not-italic leading-[128%] text-center text-[#2E2E2E]">
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

          <h3 className="mt-[72px] font-afacad text-[48px] font-medium text-left not-italic leading-[96%] text-[#2E2E2E]">
            Frequently asked questions
          </h3>
        </div>
      </div>
    </div>
  );
}
