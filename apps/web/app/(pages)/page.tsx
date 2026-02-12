import React from "react";

import AdminLanding from "@good-dog/components/landing-pages/AdminLanding";
import GeneralLanding from "@good-dog/components/landing-pages/GeneralLanding";
import MediaMakerLanding from "@good-dog/components/landing-pages/MediaMakerLanding";
import ModeratorLanding from "@good-dog/components/landing-pages/ModeratorLanding";
import MusicianLanding from "@good-dog/components/landing-pages/MusicianLanding";
import PageContainer from "@good-dog/components/PageContainer";
import { Role } from "@good-dog/db";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

export default async function Home() {
  const user = await trpc.user();

  if (user?.role === Role.MUSICIAN) {
    void trpc.userMusic.prefetch();
  }
  if (user?.role === Role.MEDIA_MAKER) {
    void trpc.mediamakerProjects.prefetch();
  }
  if (user?.role === Role.ADMIN) {
    void trpc.media.prefetch();
    void trpc.music.prefetch();
    void trpc.adminData.prefetch();
  }
  if (user?.role === Role.MODERATOR) {
    void trpc.media.prefetch();
    void trpc.music.prefetch();
  }

  return (
    <>
      {user && (
        <PageContainer background="solid">
          <HydrateClient>
            {user.role === Role.MUSICIAN && <MusicianLanding />}
            {user.role === Role.MEDIA_MAKER && <MediaMakerLanding />}
            {user.role === Role.ADMIN && <AdminLanding />}
            {user.role === Role.MODERATOR && <ModeratorLanding />}
          </HydrateClient>
        </PageContainer>
      )}
      {!user && (
        <PageContainer background="solid">
          <GeneralLanding />
        </PageContainer>
      )}
    </>
  );
}
