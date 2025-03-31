import MediamakerAccountPage from "@good-dog/components/projects/MediamakerAccountPage";

// import { HydrateClient, trpc } from "@good-dog/trpc/server";

export const dynamic = "force-dynamic";

export default async function MatchingPage() {
  // await Promise.all([
  //   void trpc.projects.prefetch(),
  //   void trpc.music.prefetch(),
  // ]);

  return (
    // <HydrateClient>
    <MediamakerAccountPage />
    // </HydrateClient>
  );
}
