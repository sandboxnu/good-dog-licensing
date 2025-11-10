import React from "react";
import { Role } from "@good-dog/db";
import GeneralLanding from "@good-dog/components/landing-pages/GeneralLanding";
import AdminLanding from "@good-dog/components/landing-pages/AdminLanding";

import MediaMakerLanding from "@good-dog/components/landing-pages/MediaMakerLanding";
import MusicianLanding from "@good-dog/components/landing-pages/MusicianLanding";
import ModeratorLanding from "@good-dog/components/landing-pages/ModeratorLanding";
import { trpc } from "@good-dog/trpc/server";

export default async function Home() {
  const user = await trpc.user();

  return (
    <>
      {user?.role === Role.MUSICIAN ? (
        <MusicianLanding />
      ) : user?.role === Role.MEDIA_MAKER ? (
        <MediaMakerLanding />
      ) : user?.role === Role.MODERATOR ? (
        <ModeratorLanding />
      ) : user?.role === Role.ADMIN ? (
        <AdminLanding />
      ) : (
        <GeneralLanding />
      )}
    </>
  );
}
