import { SidebarTab } from "@good-dog/components/landing-pages/components/staff/SideBar";
import StaffLanding from "@good-dog/components/landing-pages/StaffLanding";
import PageContainer from "@good-dog/components/PageContainer";
import { Role } from "@good-dog/db";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

export default async function SongsPage() {
  const user = await trpc.user();

  void trpc.allMusic.prefetch();

  return (
    <PageContainer background="solid" widthType="large">
      <HydrateClient>
        <StaffLanding
          activeTab={SidebarTab.SONGS}
          isAdminView={user?.role === Role.ADMIN}
        />
      </HydrateClient>
    </PageContainer>
  );
}
