import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@good-dog/ui/accordion";

export default function FaqSection() {
  return (
    <div>
      <h3 className="text-left text-[28px] font-medium not-italic leading-[96%] text-dark-gray-500 dark:text-mint-300 md:text-[48px]">
        Frequently asked questions
      </h3>
      <Accordion multiple={false} className="mt-[36px] gap-[8px]">
        <AccordionItem
          value="faq-1"
          className="rounded-[24px] border border-cream-400 bg-cream-100 px-[24px] shadow-card-light dark:border-[#454545] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#454545]"
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
          className="rounded-[24px] border border-cream-400 bg-cream-100 px-[24px] shadow-card-light dark:border-[#454545] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#454545]"
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
          className="rounded-[24px] border border-cream-400 bg-cream-100 px-[24px] shadow-card-light dark:border-[#454545] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#454545]"
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
          className="rounded-[24px] border border-cream-400 bg-cream-100 px-[24px] shadow-card-light dark:border-[#454545] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#454545]"
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
    </div>
  );
}
