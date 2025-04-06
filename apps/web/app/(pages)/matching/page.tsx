import { HydrateClient, trpc } from "@good-dog/trpc/server";

export default async function MatchingPage() {
  await Promise.all([
    void trpc.projects.prefetch(),
    void trpc.music.prefetch(),
  ]);

  return (
    <HydrateClient>
      <div>PLACEHOLDER</div>
      {/* we have a music list, and then a creation tab component as well */}
    </HydrateClient>
  );
}
