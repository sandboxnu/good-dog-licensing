import PageContainer from "@good-dog/components/PageContainer";
import SongRequestDashboard from "@good-dog/components/song-request/SongRequestDashboard";
import { trpc } from "@good-dog/trpc/server";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MediaMakerMatchingPage({ params }: PageProps) {
  const { id: songRequestId } = await params;

  void trpc.getSongRequestById.prefetch({ songRequestId });

  return (
    <PageContainer background="solid">
      <SongRequestDashboard songRequestId={songRequestId} />
    </PageContainer>
  );
}
