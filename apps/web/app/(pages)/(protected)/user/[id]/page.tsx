import { notFound } from "next/navigation";

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

  const [currentUser, targetUser] = await Promise.all([
    trpc.user(),
    trpc.userById({ userId }),
  ]);

  const isArtist =
    currentUser?.role === "MEDIA_MAKER" || currentUser?.role === "MUSICIAN";
  const targetIsStaff =
    targetUser.role === "ADMIN" || targetUser.role === "MODERATOR";

  // Sends the User to 404 to hide that the user id associates with an admin/moderator
  if (isArtist && targetIsStaff) {
    notFound();
  }

  void trpc.userById.prefetch({ userId });

  return (
    <PageContainer background="solid" widthType="large">
      <AristProfile userId={userId} />
    </PageContainer>
  );
}
