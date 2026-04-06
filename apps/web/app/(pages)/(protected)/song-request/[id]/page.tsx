import PageContainer from "@good-dog/components/PageContainer";
import AdmModMatchingDashboard from "@good-dog/components/matching/AdmModMatchingDashboard";
import MediaMakerSongRequestDashboard from "@good-dog/components/song-request/MediaMakerSongRequestDashboard";
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
  void trpc.allMusic.prefetch();

  return (
    <PageContainer background="solid" widthType="large">
      <HydrateClient>
        {user && user.role === Role.MEDIA_MAKER && (
          <MediaMakerSongRequestDashboard songRequestId={songRequestId} />
        )}
        {user && (user.role === Role.ADMIN || user.role === Role.MODERATOR) && (
          <AdmModMatchingDashboard songRequestId={songRequestId} />
        )}
      </HydrateClient>
    </PageContainer>
  );
}
