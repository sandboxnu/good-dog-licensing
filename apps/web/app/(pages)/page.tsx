"use client";
import React from "react";
import { trpc } from "@good-dog/trpc/client";
import { Role } from "@good-dog/db";
import GeneralLanding from "@good-dog/components/landing-pages/GeneralLanding";
import AdminLanding from "@good-dog/components/landing-pages/AdminLanding";

import MediaMakerLanding from "@good-dog/components/landing-pages/MediaMakerLanding";
import MusicianLanding from "@good-dog/components/landing-pages/MusicianLanding";
import ModeratorLanding from "@good-dog/components/landing-pages/ModeratorLanding";
import Header from "@good-dog/components/landing-pages/components/Header";

export default function Home() {
  const [user] = trpc.user.useSuspenseQuery();

  return (
    <>
    <Header title={"f"} subtitle={"f"}/>
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
