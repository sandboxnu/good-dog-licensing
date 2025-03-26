import NewAdminDashboard from "@good-dog/components/admin/NewAdminDashboard";
import { trpc } from "@good-dog/trpc/server";

export default async function Page() {
  const user = await trpc.user();

  if (!user || user.role != "ADMIN") {
    return <p>Forbidden</p>;
  }

  return <NewAdminDashboard></NewAdminDashboard>;
}
