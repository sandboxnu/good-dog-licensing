import PageContainer from "@good-dog/components/PageContainer";
import SongRequestDashboard from "@good-dog/components/project/SongRequestDashboard";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id: projectId } = await params;

  return (
    <PageContainer background="solid">
      <SongRequestDashboard projectId={projectId} />
    </PageContainer>
  );
}
