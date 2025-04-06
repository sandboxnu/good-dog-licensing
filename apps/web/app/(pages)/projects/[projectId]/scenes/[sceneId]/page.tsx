import MusicSection from "@good-dog/components/projects/scene-info/MusicSection";
import SceneSection from "@good-dog/components/projects/scene-info/SceneSection";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

export default async function SceneInfoPage({
  params,
}: {
  params: {
    projectId: string;
    sceneId: string;
  };
}) {
  const { projectId, sceneId } = params;

  await Promise.all([
    void trpc.mediamakerMatches.prefetch({
      projectId: projectId,
      sceneId: sceneId,
    }),
    void trpc.scene.prefetch({
      projectId,
      sceneId,
    }),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col md:flex-row">
        <HydrateClient>
          <SceneSection projectId={projectId} sceneId={sceneId} />
          <MusicSection projectId={projectId} sceneId={sceneId} />
        </HydrateClient>
      </div>
    </div>
  );
}
