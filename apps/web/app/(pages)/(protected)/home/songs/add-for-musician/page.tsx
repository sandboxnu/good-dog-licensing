import PageContainer from "@good-dog/components/PageContainer";
import AdminMusicSubmission from "@good-dog/components/submit/music/AdminMusicSubmission";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

export default function AddSongForMusicianPage() {
  void trpc.musicians.prefetch();

  return (
    <PageContainer background="solid" widthType="large">
      <HydrateClient>
        <AdminMusicSubmission />
      </HydrateClient>
    </PageContainer>
  );
}
