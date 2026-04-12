import PageContainer from "@good-dog/components/PageContainer";
import MediaMakerProjectDashboard from "@good-dog/components/project/MediaMakerProjectDashboard";
import { trpc } from "@good-dog/trpc/server";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id: projectId } = await params;

  void trpc.getProjectSubmissionById.prefetch({ projectId });

  return (
    <PageContainer background="solid" widthType="large">
      <MediaMakerProjectDashboard projectId={projectId} />
    </PageContainer>
  );
}
