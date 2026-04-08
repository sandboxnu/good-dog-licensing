"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ManWithSax from "@good-dog/components/svg/homepage/ManWithSax";
import WomanInComputer from "@good-dog/components/svg/homepage/WomanInComputer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@good-dog/ui/accordion";

import Button from "../base/Button";
import DownArrow from "../svg/DownArrow";
import GreenOval from "../svg/GreenOval";
import Check from "../svg/homepage/Check";
import LandingLogo from "../svg/homepage/LandingLogo";
import ThinkingPerson from "../svg/homepage/ThinkingPerson";

export default function GeneralLanding() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden pb-[100px]">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full flex-col justify-center text-center">
          <h1 className="text-body-primary pt-[64px] font-righteous text-[40px] font-normal leading-tight text-dark-gray-500 dark:text-mint-300 md:text-[72px] md:leading-[80px]">
            Connecting musicians and media makers
          </h1>
          <p className="mt-[16px] text-center text-[20px] font-medium leading-[104%] text-dark-gray-500 dark:text-gray-300 md:text-[35px]">
            Northeastern University's free, student-run music synchronization
            service.
          </p>
          <h2 className="mt-[40px] text-center text-[28px] font-medium leading-[96%] text-green-400 dark:text-mint-200 md:text-[48px]">
            Say "Yes" to Licensing!
          </h2>
          <div className="mt-[16] flex items-center justify-center">
            <DownArrow />
          </div>

          <div className="mt-[80px] flex w-full flex-col-reverse gap-[40px] rounded-[24px] border border-[#ECE6DF] bg-cream-100 px-[24px] py-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#403F3E] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#171717] md:flex-row md:px-[48px]">
            <div className="flex min-w-0 flex-col items-center justify-center text-left md:items-start">
              <h3 className="text-[28px] font-normal dark:text-mint-300 md:text-[48px]">
                Good Dog Licensing
              </h3>
              <p className="mt-[8px] w-full break-words text-[16px] font-medium leading-[128%] dark:text-gray-300 md:text-[18px]">
                Good Dog Licensing connects creatives by providing a legal
                framework for media producers to source high quality music from
                independent artists
                <Footnote
                  number={1}
                  tooltip="Good Dog artists are independent, meaning they have not signed with a Record Label or Music Publisher and own 100% of the copyright to both the Sound Recording and Musical Composition."
                />{" "}
                for their media projects. Good Dog Licensing connects
                independent media makers
                <Footnote
                  number={2}
                  tooltip="A Media Maker is anyone who needs music for their audiovisual project. This could be social media content, short films, podcast intros and much more."
                />{" "}
                with independent musicians to enhance media projects and help
                musicians grow their audiences – all for free!
              </p>
              <div className="mt-[32px] w-full">
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
            <div className="flex w-full flex-shrink-0 items-center justify-center md:h-[464px] md:w-[464px]">
              <LandingLogo />
            </div>
          </div>

          <div className="text-left">
            <h3 className="mt-[72px] text-[28px] font-medium leading-[96%] dark:text-mint-300 md:text-[48px]">
              Our mission and vision.{" "}
              <span className="text-green-400 dark:text-mint-200">
                Connecting Creatives.
              </span>
            </h3>
            <h3 className="mt-[8px] text-[16px] font-normal leading-[128%] text-green-500 dark:text-mint-200 md:text-[20px]">
              Discover how our platform connects creators, simplifies licensing,
              and ensures fair collaboration for everyone involved.
            </h3>
          </div>

          <div className="mt-[36px] flex flex-col gap-[56px] md:flex-row">
            <div className="flex flex-1 flex-col items-center self-stretch overflow-hidden rounded-[24px] border border-[#ECE6DF] bg-cream-100 px-[24px] py-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#403F3E] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#171717]">
              <div className="flex items-center justify-center">
                <WomanInComputer />
              </div>
              <h3 className="mt-[8px] text-center text-[28px] font-medium not-italic leading-[104%] text-green-400 dark:text-mint-200 md:text-[40px]">
                Sign up as a Media Maker
              </h3>
              <p className="mt-[16px] w-full break-words text-center text-[16px] font-normal not-italic leading-[128%] text-green-500 dark:text-mint-200 md:text-[20px]">
                Submit a description of your project and the type of music
                you're looking for. Good Dog takes care of everything and at no
                cost to you.
              </p>
              <div className="mt-[16px]">
                <Button
                  label="Sign up now"
                  size="large"
                  variant="outlined"
                  onClick={() => router.push("/signup")}
                  shadow
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center self-stretch overflow-hidden rounded-[24px] border border-[#ECE6DF] bg-cream-100 px-[24px] py-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#403F3E] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#171717]">
              <div className="flex items-center justify-center">
                <ManWithSax />
              </div>
              <h3 className="mt-[8px] text-center text-[28px] font-medium not-italic leading-[104%] text-green-400 dark:text-mint-200 md:text-[40px]">
                Sign up as a Musician
              </h3>
              <p className="mt-[16px] w-full break-words text-center text-[16px] font-normal not-italic leading-[128%] text-green-500 dark:text-mint-200 md:text-[20px]">
                Submit your music{" "}
                <Footnote
                  number={3}
                  tooltip="Music contains two copyrightable works: the Sound Recording (The actual recorded sounds), and the underlying Musical Work (the composition, melody, and lyrics)."
                />{" "}
                to our extensive catalog – we're open to all genres and styles.
                You'll be notified when media makers want to place your music in
                their projects!
              </p>
              <div className="mt-[16px]">
                <Button
                  label="Sign up now"
                  size="large"
                  variant="outlined"
                  onClick={() => router.push("/signup")}
                  shadow
                />
              </div>
            </div>
          </div>

          <div className="mt-[72px] flex flex-col">
            <div className="text-left">
              <h3 className="text-[28px] font-medium not-italic leading-[96%] text-dark-gray-500 dark:text-mint-300 md:text-[48px]">
                What makes Good Dog{" "}
                <span className="text-green-400 dark:text-mint-200">
                  "Good"?
                </span>
              </h3>
              <p className="mt-[8px] text-[16px] font-normal not-italic leading-[128%] text-dark-gray-500 dark:text-gray-300 md:text-[20px]">
                We are not in it for the money. REALLY.
              </p>
            </div>
            <div className="mt-[36px] flex flex-col gap-[32px] md:flex-row">
              <div className="flex items-center justify-center md:justify-start">
                <ThinkingPerson />
              </div>
              <div className="grid auto-rows-fr grid-cols-1 gap-[8px] sm:grid-cols-2">
                <div className="flex items-center gap-[10px] rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#403F3E] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#171717]">
                  <div className="h-[24px] w-[24px] flex-shrink-0">
                    <Check />
                  </div>
                  <p className="min-w-0 flex-1 break-words text-left text-[16px] font-medium not-italic leading-[128%] text-dark-gray-500 dark:text-mint-200 md:text-[18px]">
                    Artists retain 100% of their copyrights
                    <Footnote
                      number={4}
                      tooltip="Copyright protects original works like music and sound recordings, granting creators exclusive rights to reproduce, distribute, perform, and adapt their content."
                    />
                    .
                  </p>
                </div>
                <div className="flex items-center gap-[10px] rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#403F3E] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#171717]">
                  <div className="h-[24px] w-[24px] flex-shrink-0">
                    <Check />
                  </div>
                  <p className="min-w-0 flex-1 break-words text-left text-[16px] font-medium not-italic leading-[128%] text-dark-gray-500 dark:text-mint-200 md:text-[18px]">
                    No up-front fee and no commission and our service is
                    non-exclusive.
                  </p>
                </div>
                <div className="flex items-center gap-[10px] rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#403F3E] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#171717]">
                  <div className="h-[24px] w-[24px] flex-shrink-0">
                    <Check />
                  </div>
                  <p className="min-w-0 flex-1 break-words text-left text-[16px] font-medium not-italic leading-[128%] text-dark-gray-500 dark:text-mint-200 md:text-[18px]">
                    Artists can say no to any synch
                    <Footnote
                      number={5}
                      tooltip="Music sync (synchronization) is licensing recorded music for use in visual media like films, ads, or social media. This requires permission for both the sound recording and the musical composition."
                    />{" "}
                    placement but you should say "Yes!"
                  </p>
                </div>
                <div className="flex items-center gap-[10px] rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#403F3E] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#171717]">
                  <div className="h-[24px] w-[24px] flex-shrink-0">
                    <Check />
                  </div>
                  <p className="min-w-0 flex-1 break-words text-left text-[16px] font-medium not-italic leading-[128%] text-dark-gray-500 dark:text-mint-200 md:text-[18px]">
                    We take the hassle out of finding picture-perfect music for
                    projects.
                  </p>
                </div>
                <div className="flex items-center gap-[10px] rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#403F3E] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#171717]">
                  <div className="h-[24px] w-[24px] flex-shrink-0">
                    <Check />
                  </div>
                  <p className="min-w-0 flex-1 break-words text-left text-[16px] font-medium not-italic leading-[128%] text-dark-gray-500 dark:text-mint-200 md:text-[18px]">
                    Artists can earn public performance royalties through ASCAP
                    or BMI.
                  </p>
                </div>
                <div className="flex items-center gap-[10px] rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#403F3E] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#171717]">
                  <div className="h-[24px] w-[24px] flex-shrink-0">
                    <Check />
                  </div>
                  <p className="min-w-0 flex-1 break-words text-left text-[16px] font-medium not-italic leading-[128%] text-dark-gray-500 dark:text-mint-200 md:text-[18px]">
                    Artists receive full attribution for all uses of their
                    music.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-[72px] w-full overflow-hidden">
            <GreenOval className="absolute left-1/2 top-0 -translate-x-1/2" />

            <div className="relative pb-[120px] pt-[120px]">
              <h2 className="text-left text-[28px] font-medium not-italic leading-[96%] text-mint-200 md:text-[48px]">
                Our contributors
              </h2>
              <p className="text-left  text-[16px] font-normal not-italic leading-normal text-gray-100 md:text-[20px]">
                Discover the people driving our platform, uniting strategy,
                creativity, and music.
              </p>

              <div className="mt-[36px] flex flex-col gap-[56px] md:flex-row">
                <div className="flex flex-1 flex-col items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#403F3E] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#2E2E2E]">
                  <div className="h-[250px] w-[250px] overflow-hidden rounded-[136px] shadow-[0_2px_6px_0_#BFBCB8]">
                    <img
                      src="/images/profHeadshot.png"
                      alt="Founder"
                      className="h-[250px] w-[250px] shadow-[0_2px_6px_0_#BFBCB8]"
                    />
                  </div>
                  <div className="mt-[8px] text-center text-[28px] font-medium not-italic leading-[104%] text-green-400 dark:text-mint-200 md:text-[40px]">
                    Founder
                  </div>
                  <div className="mt-[16px] break-words text-left text-[16px] font-medium not-italic leading-[128%] text-dark-gray-500 dark:text-gray-300 md:text-[18px]">
                    Professor Herlihy is a professor in both the College of
                    Arts, Media, and Design at Northeastern, and at the Law
                    School, runs his own entertainment law practice, and
                    frequently writes and records original music. Students in
                    Professor Herlihy's Music Licensing for Media course work
                    with Good Dog Licensing throughout the semester, gaining
                    hands-on experience in A&R, Music Supervisions
                    <Footnote
                      number={5}
                      tooltip="Music supervision is the art of selecting and licensing preexisting songs or recordings for use in visual media like film, television, video games, and advertising."
                    />
                    , and Music Licensing.
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center gap-[10px] self-stretch rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#403F3E] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#2E2E2E]">
                  <div className="flex h-[250px] w-[250px] flex-col items-center justify-center overflow-hidden rounded-[136px] shadow-[0_2px_6px_0_#BFBCB8] dark:bg-mint-300">
                    <img
                      src="/images/greenLineRecords.png"
                      alt="Green Line Records"
                      className="h-[178.6px] w-[224px]"
                    />
                  </div>
                  <div className="mt-[8px] text-center text-[28px] font-medium not-italic leading-[104%] text-green-400 dark:text-mint-200 md:text-[40px]">
                    Green Line Records
                  </div>
                  <div className="mt-[16px] break-words text-left text-[16px] font-medium not-italic leading-[128%] text-dark-gray-500 dark:text-gray-300 md:text-[18px]">
                    Green Line Records is Northeastern University's student-run
                    record label. Green Line Records aims to showcase Boston's
                    music scene by offering their artists a full range of
                    services within A&R, Recording, Events, and Creative
                    Services departments. Good Dog Licensing operates as Green
                    Line Record's licensing department, offering musicians and
                    media makers the chance to connect with Green Line Record
                    and utilize their services.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <FaqSection />
        </div>
      </div>
    </div>
  );
}

function FaqSection() {
  return (
    <>
      <h3 className="mt-[72px] text-left text-[28px] font-medium not-italic leading-[96%] text-dark-gray-500 dark:text-mint-300 md:text-[48px]">
        Frequently asked questions
      </h3>
      <Accordion multiple={false} className="mt-[36px] gap-[8px]">
        <AccordionItem
          value="faq-1"
          className="rounded-[24px] border border-[#ECE6DF] bg-cream-100 px-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#454545] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#454545]"
        >
          <AccordionTrigger className="py-[24px] text-[20px] font-semibold text-green-400 dark:text-mint-200">
            What are PROs and why should I register?
          </AccordionTrigger>
          <AccordionContent className="pb-[24px] text-left text-[18px] font-medium text-dark-gray-500 dark:text-gray-300">
            They are Performance Rights Organizations such as BMI and ASCAP. In
            this case, it&apos;s a great way to keep track of where the media
            that uses your song is being performed. When Media Makers submit cue
            sheets, they&apos;ll do it through a PRO and then if they get paid,
            you&apos;ll make royalties automatically.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="faq-2"
          className="rounded-[24px] border border-[#ECE6DF] bg-cream-100 px-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#454545] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#454545]"
        >
          <AccordionTrigger className="py-[24px] text-[20px] font-semibold text-green-400 dark:text-mint-200">
            What if the media Good Dog wants to sync my song in isn&apos;t my
            vibe?
          </AccordionTrigger>
          <AccordionContent className="pb-[24px] text-left text-[18px] font-medium text-dark-gray-500 dark:text-gray-300">
            It&apos;s still a great way to reach a wider audience and get
            traction. But at the end of the day, if you don&apos;t want your
            music in a specific project, you get the last call!
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="faq-3"
          className="rounded-[24px] border border-[#ECE6DF] bg-cream-100 px-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#454545] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#454545]"
        >
          <AccordionTrigger className="py-[24px] text-[20px] font-semibold text-green-400 dark:text-mint-200">
            How long before I need my project done should I reach out to Good
            Dog?
          </AccordionTrigger>
          <AccordionContent className="pb-[24px] text-left text-[18px] font-medium text-dark-gray-500 dark:text-gray-300">
            It&apos;s never too early! Reach out to us as early in the process
            as possible. When you&apos;re developing a story, let&apos;s have a
            conversation about the kind of music you need so we can get started.
            We&apos;d love to hear about your project and ideas ASAP!
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="faq-4"
          className="rounded-[24px] border border-[#ECE6DF] bg-cream-100 px-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#454545] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#454545]"
        >
          <AccordionTrigger className="py-[24px] text-[20px] font-semibold text-green-400 dark:text-mint-200">
            I normally just use an MP3 converter to get whatever music I need
            from Youtube. Why should I stop?
          </AccordionTrigger>
          <AccordionContent className="pb-[24px] text-left text-[18px] font-medium text-dark-gray-500 dark:text-gray-300">
            That won&apos;t fly if you&apos;re submitting your work to festivals
            or if you get offered a theatrical license. License your music
            properly so that your work has legs, and learn about writing music
            briefs/collaborating with music supervisors while you&apos;re at it.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

function Footnote({ number, tooltip }: { number: number; tooltip: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail !== number) setOpen(false);
    };
    window.addEventListener("close-footnotes", handler as EventListener);
    return () =>
      window.removeEventListener("close-footnotes", handler as EventListener);
  }, [number]);

  const handleClick = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      window.dispatchEvent(
        new CustomEvent("close-footnotes", { detail: number }),
      );
    }
  };

  return (
    <span className="relative">
      <sup
        className="font-afacad cursor-pointer font-medium not-italic leading-[128%] text-green-400 hover:underline dark:text-mint-200"
        onClick={handleClick}
      >
        [{number}]
      </sup>
      {open && (
        <span className="absolute bottom-full left-1/2 z-10 mb-1 flex w-[400px] -translate-x-1/2 flex-col items-start justify-center rounded-[8px] border border-cream-500 bg-gray-100 p-[16px] dark:border-[#403F3E] dark:bg-dark-gray-600 dark:shadow-[0_2px_6px_0_#171717]">
          <span className="text-[14px] font-normal leading-[96%] text-gray-500 dark:text-gray-300">
            {tooltip}
          </span>
        </span>
      )}
    </span>
  );
}
