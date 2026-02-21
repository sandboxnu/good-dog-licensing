import PageContainer from "@good-dog/components/PageContainer";
import MatchingDashboard from "@good-dog/components/matching/MatchingDashboard";
import SongRequestDashboard from "@good-dog/components/song-request/SongRequestDashboard";
import { Role } from "@good-dog/db";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SongRequestPage({ params }: PageProps) {
  const user = await trpc.user();
  const { id: songRequestId } = await params;

  void trpc.getSongRequestById.prefetch({ songRequestId });

  return (
    <PageContainer background="solid">
      <HydrateClient>
        {user && user.role === Role.MEDIA_MAKER && (
          <SongRequestDashboard songRequestId={songRequestId} />
        )}
        {user && (user.role === Role.ADMIN || user.role === Role.MODERATOR) && (
          <MatchingDashboard songRequestId={songRequestId} />
        )}
      </HydrateClient>
    </PageContainer>
  );
}
