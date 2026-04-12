import PageContainer from "@good-dog/components/PageContainer";
import SongRequestSubmissionWidget from "@good-dog/components/submit/song-request/SongRequestSubmissionWidget";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const projectId = params.id;
  return (
    <PageContainer background="solid" widthType="large">
      <SongRequestSubmissionWidget projectId={projectId} />
    </PageContainer>
  );
}
