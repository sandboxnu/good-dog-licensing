import MediamakerScenes from "@good-dog/components/projects/MediamakerScenes";

// import { trpc } from "@good-dog/trpc/client";
// import { HydrateClient } from "@good-dog/trpc/server";

interface ProjectScenePageProps {
  params: {
    projectId: string;
  };
}

export default async function ProjectScenesPage({
  params,
}: ProjectScenePageProps) {
  // // this should get a list of scenes for the given project
  // await Promise.all([
  //   void trpc.mediamakerScenes.prefetch({
  //     projectId: params.projectId,
  //   }),
  // ]);

  return (
    //<HydrateClient>
    <MediamakerScenes params={{ projectId: params.projectId }} />
    //</HydrateClient>
  );
}
