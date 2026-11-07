import PageContainer from "@good-dog/components/PageContainer";
import PendingSongReview from "@good-dog/components/submit/music/PendingSongReview";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReviewSongPage({ params }: PageProps) {
  const { id: musicId } = await params;

  void trpc.pendingMusicSubmissionForReview.prefetch({ musicId });
  void trpc.getMusicSubmissionPrefillVals.prefetch();

  return (
    <PageContainer background="solid" widthType="large">
      <HydrateClient>
        <PendingSongReview musicId={musicId} />
      </HydrateClient>
    </PageContainer>
  );
}
