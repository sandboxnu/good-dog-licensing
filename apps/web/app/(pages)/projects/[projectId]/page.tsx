import MediamakerScenes from "@good-dog/components/projects/MediamakerScenes";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

interface ProjectScenePageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectScenesPage({
  params,
}: ProjectScenePageProps) {
  const projectId = (await params).projectId;

  // this should get a list of scenes for the given project
  void trpc.mediamakerScenes.prefetch({
    projectId: projectId,
  });

  return (
    <HydrateClient>
      <MediamakerScenes projectId={projectId} />
    </HydrateClient>
  );
}
