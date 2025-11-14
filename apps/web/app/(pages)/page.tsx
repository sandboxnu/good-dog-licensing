import React from "react";
import { Role } from "@good-dog/db";
import GeneralLanding from "@good-dog/components/landing-pages/GeneralLanding";
import MediaMakerLanding from "@good-dog/components/landing-pages/MediaMakerLanding";
import MusicianLanding from "@good-dog/components/landing-pages/MusicianLanding";
import ModeratorLanding from "@good-dog/components/landing-pages/ModeratorLanding";
import { HydrateClient, trpc } from "@good-dog/trpc/server";
import AdminLanding from "@good-dog/components/landing-pages/AdminLanding";
import PageContainer from "@good-dog/components/PageContainer";

export default async function Home() {
  const user = await trpc.user();

  if (user?.role === Role.MUSICIAN) {
    void trpc.userMusic.prefetch();
  }
  if (user?.role === Role.MEDIA_MAKER) {
    void trpc.mediamakerProjects.prefetch();
  }

  return (
    <PageContainer background="gradient">
      {user && (
        <HydrateClient>
          {user.role === Role.MUSICIAN && <MusicianLanding />}
          {user.role === Role.MEDIA_MAKER && <MediaMakerLanding />}
          {user.role === Role.ADMIN && <AdminLanding />}
          {user.role === Role.MODERATOR && <ModeratorLanding />}
        </HydrateClient>
      )}
      {!user && <GeneralLanding />}
    </PageContainer>
  );
}
