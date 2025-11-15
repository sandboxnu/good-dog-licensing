import PageContainer from "@good-dog/components/PageContainer";

export default function FAQ() {
  return (
    <PageContainer background="solid">
      <div className="flex flex-col gap-[40px] w-full text-left">
        <div className="w-full text-center">
          <h2>Frequently Asked Questions</h2>
        </div>
        <Section
          question="What is licensing?"
          answer="Licensing is ................"
        />
        <Section
          question='Why say "YES" to licensing?'
          answer='You should say "YES" to licensing because ............'
        />
        <Section
          question="What is synchronization?"
          answer="Music sync, or synchronization licensing, is the process of using a piece of recorded music in conjunction with a visual work, such as a film, TV show, social media reel, advertisement, or video game."
        />
      </div>
    </PageContainer>
  );
}

interface SectionProps {
  question: string;
  answer: string;
}

function Section({ question, answer }: SectionProps) {
  return (
    <div className="flex flex-col gap-[10px]">
      <h3>{`Q: ${question}`}</h3>
      <div className="pl-[10px]">
        <p className="text-[20px]">{`A: ${answer}`}</p>
      </div>
    </div>
  );
}
