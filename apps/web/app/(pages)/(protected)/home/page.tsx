import React from "react";

import { SidebarTab } from "@good-dog/components/landing-pages/components/staff/SideBar";
import MediaMakerLanding from "@good-dog/components/landing-pages/MediaMakerLanding";
import MusicianLanding from "@good-dog/components/landing-pages/MusicianLanding";
import StaffLanding from "@good-dog/components/landing-pages/StaffLanding";
import PageContainer from "@good-dog/components/PageContainer";
import { Role } from "@good-dog/db";
import { CREATED_DATE_QUERY } from "@good-dog/trpc/schema";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

export default async function Home() {
  const user = await trpc.user();

  if (!user) {
    // The code should never get here. Validated by layout.
    return <div>Something went wrong.</div>;
  }

  if (user.role === Role.MUSICIAN) {
    void trpc.userMusic.prefetch();
  }
  if (user.role === Role.MEDIA_MAKER) {
    void trpc.mediamakerProjects.prefetch();
  }
  const isStaff = user.role === Role.ADMIN || user.role === Role.MODERATOR;
  if (isStaff) {
    void trpc.queryAllProjects.prefetch({
      createdDateQuery: CREATED_DATE_QUERY.LAST_365_DAYS,
      assignedToMe: false,
    });
  }

  return (
    <PageContainer background="solid" widthType="large">
      <HydrateClient>
        {user.role === Role.MUSICIAN && <MusicianLanding />}
        {user.role === Role.MEDIA_MAKER && <MediaMakerLanding />}
        {isStaff && (
          <StaffLanding
            activeTab={SidebarTab.SUBMISSIONS}
            isAdminView={user.role === Role.ADMIN}
          />
        )}
      </HydrateClient>
    </PageContainer>
  );
}
