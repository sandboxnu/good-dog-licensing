import MediamakerAccountPage from "@good-dog/components/projects/MediamakerAccountPage";
// import { HydrateClient, trpc } from "@good-dog/trpc/server";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  //await Promise.all([void trpc.projects.prefetch()]);

  return (
    //<HydrateClient>
      <MediamakerAccountPage />
    //</HydrateClient>
  );
}
