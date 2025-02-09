import { ProjectList } from "@good-dog/components/matching/ProjectList";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

export const dynamic = "force-dynamic";

export default async function MatchingPage() {
  await Promise.all([
    void trpc.getProjects.prefetch(),
    void trpc.getMusic.prefetch(),
  ]);

  return (
    <HydrateClient>
      <ProjectList />
      {/* we have a music list, and then a creation tab component as well */}
    </HydrateClient>
  );
}
