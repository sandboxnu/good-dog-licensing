import NewAdminDashboard from "@good-dog/components/dashboard/NewAdminDashboard";

const pageSlugs = ["users", "projects", "songs"] as const;
type PageSlug = (typeof pageSlugs)[number];

export function generateStaticParams() {
  return pageSlugs.map((slug) => ({
    slug: slug,
  }));
}

export const dynamicParams = false;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: PageSlug }>;
}) {
  const { slug } = await params;

  return <NewAdminDashboard page={slug}></NewAdminDashboard>;
}
