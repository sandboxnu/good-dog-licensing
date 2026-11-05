import AboutPage from "@good-dog/components/about/AboutPage";
import PageContainer from "@good-dog/components/PageContainer";

export default function About() {
  return (
    <PageContainer background="gradient" widthType="full" smallHeader={true}>
      <AboutPage />
    </PageContainer>
  );
}
