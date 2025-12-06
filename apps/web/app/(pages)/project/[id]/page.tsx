import PageContainer from "@good-dog/components/PageContainer";
import SongRequestDashboard from "@good-dog/components/project/SongRequestDashboard";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const projectId = params.id;
  return (
    <PageContainer background="solid">
      <SongRequestDashboard projectId={projectId} />
    </PageContainer>
  );
}
