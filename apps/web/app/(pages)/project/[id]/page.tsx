import PageContainer from "@good-dog/components/PageContainer";
import ProjectDashboard from "@good-dog/components/project/ProjectDashboard";
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
    <PageContainer background="solid">
      <ProjectDashboard projectId={projectId} />
    </PageContainer>
  );
}
