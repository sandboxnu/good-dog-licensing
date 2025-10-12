import MediamakerAccountPage from "@good-dog/components/oldStuff/projects/MediamakerAccountPage";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  void trpc.mediamakerProjects.prefetch();

  return (
    <HydrateClient>
      <MediamakerAccountPage />
    </HydrateClient>
  );
}
