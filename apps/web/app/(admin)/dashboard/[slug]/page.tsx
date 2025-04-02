import { notFound } from "next/navigation";

import NewAdminDashboard from "@good-dog/components/dashboard/NewAdminDashboard";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug || (slug !== "songs" && slug !== "projects" && slug !== "users")) {
    return notFound();
  }

  return <NewAdminDashboard page={slug}></NewAdminDashboard>;
}
