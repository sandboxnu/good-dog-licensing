import { adminPagePermissions } from "@good-dog/auth/permissions";
import AdminDashboard from "@good-dog/components/admin/AdminDashboard";
import { withPermissions } from "@good-dog/components/PermissionsWrapper";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

export const dynamic = "force-dynamic";

const AdminPage = async () => {
  void trpc.adminData.prefetch();

  return (
    <HydrateClient>
      <AdminDashboard />
    </HydrateClient>
  );
};

export default withPermissions(adminPagePermissions, AdminPage);
