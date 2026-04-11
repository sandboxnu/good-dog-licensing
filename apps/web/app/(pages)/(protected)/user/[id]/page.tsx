import PageContainer from "@good-dog/components/PageContainer";
import AristProfile from "@good-dog/components/user-onboarding/widgets/profile/ArtistProfile";
import { trpc } from "@good-dog/trpc/server";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id: userId } = await params;

  void trpc.userById.prefetch({ userId });

  return (
    <PageContainer background="solid" widthType="large">
      <AristProfile userId={userId} />
    </PageContainer>
  );
}
