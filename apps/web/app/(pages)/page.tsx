"use client";
import type { ReactNode } from "react";
import React from "react";
import { Button } from "@good-dog/ui/button";
import { useRouter } from "next/navigation";
import WomanInComputer from "@good-dog/components/svg/homepage/WomanInComputer";
import ManWithSax from "@good-dog/components/svg/homepage/ManWithSax";
import CoupleWithGuitar from "@good-dog/components/svg/homepage/CoupleWithGuitar";
import PuzzleBuilding from "@good-dog/components/svg/homepage/PuzzleBuilding";
import MusicStudio from "@good-dog/components/svg/homepage/MusicStudio";
import { trpc } from "@good-dog/trpc/client";
import { Role } from "@good-dog/db";
import GeneralLanding from "@good-dog/components/landing-pages/GeneralLanding";
import AdminLanding from "@good-dog/components/landing-pages/AdminLanding";

import { UserWithSession } from "@good-dog/trpc/types";
import MediaMakerLanding from "@good-dog/components/landing-pages/MediaMakerLanding";
import MusicianLanding from "@good-dog/components/landing-pages/MusicianLanding";
import ModeratorLanding from "@good-dog/components/landing-pages/ModeratorLanding";

export default function Home() {
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
