import PageContainer from "@good-dog/components/PageContainer";
import MusicDashboard from "@good-dog/components/music/MusicDashboard";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id: musicId } = await params;

  return (
    <PageContainer background="solid">
      <MusicDashboard musicId={musicId} />
    </PageContainer>
  );
}
