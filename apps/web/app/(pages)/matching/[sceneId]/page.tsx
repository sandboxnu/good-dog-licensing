// import MainMatchingPage from "@good-dog/components/matching/MainMatchingPage";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ songRequestId: string }>;
}) {
  const { songRequestId } = await params;

  void trpc.getSongRequestById.prefetch({ songRequestId });
  void trpc.music.prefetch();

  return (
    <HydrateClient>
      {/* <MainMatchingPage songRequestId={songRequestId} /> */}
      <div></div>
    </HydrateClient>
  );
}
