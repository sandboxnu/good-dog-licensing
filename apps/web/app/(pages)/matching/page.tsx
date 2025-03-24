import { projectAndRepetoirePagePermissions } from "@good-dog/auth/permissions";
import { withPermissions } from "@good-dog/components/PermissionsWrapper";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

export const dynamic = "force-dynamic";

const MatchingPage = async () => {
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
};

export default withPermissions(
  projectAndRepetoirePagePermissions,
  MatchingPage,
);
