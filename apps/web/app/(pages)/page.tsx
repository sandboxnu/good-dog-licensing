"use client";
import React from "react";
import dynamic from "next/dynamic";
import { trpc } from "@good-dog/trpc/client";
import { Role } from "@good-dog/db";

// Import landing pages
import GeneralLanding from "@good-dog/components/landing-pages/GeneralLanding";
import AdminLanding from "@good-dog/components/landing-pages/AdminLanding";
import MediaMakerLanding from "@good-dog/components/landing-pages/MediaMakerLanding";
import MusicianLanding from "@good-dog/components/landing-pages/MusicianLanding";
import ModeratorLanding from "@good-dog/components/landing-pages/ModeratorLanding";

function HomeContent() {
  const [user] = trpc.user.useSuspenseQuery();

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

// Disable SSR for this component
export default dynamic(() => Promise.resolve(HomeContent), {
  ssr: false,
  loading: () => <div>Loading...</div>, // Optional loading state
});