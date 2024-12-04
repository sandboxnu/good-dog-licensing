import AdminDashboard from "@good-dog/components/admin/AdminDashboard";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  void trpc.adminData.prefetch();

  return (
    <HydrateClient>
      <AdminDashboard />
    </HydrateClient>
  );
}
