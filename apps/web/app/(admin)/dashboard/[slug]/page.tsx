import NewAdminDashboard from "@good-dog/components/admin/NewAdminDashboard";
import { trpc } from "@good-dog/trpc/server";

import NotFound from "~/not-found";

export default async function Page({ params }: { params: { slug: string } }) {
  const user = await trpc.user();
  const { slug } = await params;

  if (!user || !(user.role === "ADMIN" || user.role === "MODERATOR")) {
    return <p>Forbidden</p>;
  }

  if (!slug || (slug !== "songs" && slug !== "projects" && slug !== "users")) {
    return <NotFound></NotFound>;
  }

  return (
    <NewAdminDashboard
      page={slug}
      userRole={user.role}
      userFirstName={user.firstName}
      userLastName={user.lastName}
    ></NewAdminDashboard>
  );
}
