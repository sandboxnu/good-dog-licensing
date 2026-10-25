import { SidebarTab } from "@good-dog/components/landing-pages/components/staff/SideBar";
import StaffLanding from "@good-dog/components/landing-pages/StaffLanding";
import PageContainer from "@good-dog/components/PageContainer";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

export default function UsersPage() {
  void trpc.allUsers.prefetch();

  return (
    <PageContainer background="solid" widthType="large">
      <HydrateClient>
        <StaffLanding activeTab={SidebarTab.USERS} isAdminView={true} />
      </HydrateClient>
    </PageContainer>
  );
}
