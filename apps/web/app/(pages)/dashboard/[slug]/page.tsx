// // import NewAdminDashboard from "@good-dog/components/dashboard/NewAdminDashboard";
// import { HydrateClient, trpc } from "@good-dog/trpc/server";

// const pageSlugs = ["users", "projects", "songs"] as const;
// type PageSlug = (typeof pageSlugs)[number];

// export function generateStaticParams() {
//   return pageSlugs.map((slug) => ({
//     slug: slug,
//   }));
// }

// export const dynamicParams = false;

// export default async function Page({
//   params,
// }: {
//   params: Promise<{ slug: PageSlug }>;
// }) {
//   const { slug } = await params;

//   void trpc.projects.prefetch();
//   void trpc.music.prefetch();

//   return (
//     <HydrateClient>
//       <div></div>
//       {/* <NewAdminDashboard page={slug}></NewAdminDashboard> */}
//     </HydrateClient>
//   );
// }
