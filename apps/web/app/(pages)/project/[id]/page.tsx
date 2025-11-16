import PageContainer from "@good-dog/components/PageContainer";
import { trpc } from "@good-dog/trpc/server";
import SongRequestDashboard from "@good-dog/components/media-maker-dashboard/SongRequestDashboard";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const projectId = params.id;

  void trpc.mediamakerSongRequests.prefetch({ projectId });

  return (
    <PageContainer background="solid">
      <SongRequestDashboard />
    </PageContainer>
  );
}
