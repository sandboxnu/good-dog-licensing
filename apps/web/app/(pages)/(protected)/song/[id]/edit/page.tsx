import PageContainer from "@good-dog/components/PageContainer";
import MusicEditWidget from "@good-dog/components/submit/music/MusicEditWidget";
import { trpc } from "@good-dog/trpc/server";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id: musicId } = await params;

  await trpc.getMusicSubmissionById.prefetch({ musicId });

  return (
    <PageContainer background="solid" widthType="large">
      <MusicEditWidget musicId={musicId} />
    </PageContainer>
  );
}
