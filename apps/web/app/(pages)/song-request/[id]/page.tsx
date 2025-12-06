import PageContainer from "@good-dog/components/PageContainer";
import MediaMakerMatchingDashboard from "@good-dog/components/meda-maker-matching/MediaMakerMatchingDashboard";
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
      <MediaMakerMatchingDashboard songRequestId={songRequestId} />
    </PageContainer>
  );
}
