import MainMatchingPage from "@good-dog/components/matching/MainMatchingPage";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ sceneId: string }>;
}) {
  const { sceneId } = await params;

  void trpc.getSceneById.prefetch({ sceneId: sceneId });
  void trpc.music.prefetch();
  void trpc.unlicensedMusic.prefetch();

  return (
    <HydrateClient>
      <MainMatchingPage sceneId={sceneId} />
    </HydrateClient>
  );
}
