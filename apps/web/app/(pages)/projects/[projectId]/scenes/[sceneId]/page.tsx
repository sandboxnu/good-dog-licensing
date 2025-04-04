import Link from "next/link";
import { ChevronLeftIcon, DividerHorizontalIcon } from "@radix-ui/react-icons";

import MusicSection from "@good-dog/components/projects/MusicSection";
import { trpc } from "@good-dog/trpc/server";
import { HydrateClient } from "@good-dog/trpc/server";
import { Badge } from "@good-dog/ui/badge";

export interface SceneInfoPageProps {
  params: {
    projectId: string;
    sceneId: string;
  };
}

export default async function SceneInfoPage({ params }: SceneInfoPageProps) {
  const { projectId, sceneId } = params;
  await Promise.all([
    void trpc.mediamakerMatches.prefetch({
      projectId: projectId,
      sceneId: sceneId,
    }),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left panel - Scene details */}
        <div className="flex w-full flex-col p-6 md:w-1/2 md:p-10">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Scene Name</h1>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Scene Added</div>
                <div className="text-sm">February 2, 2025</div>
              </div>
              <DividerHorizontalIcon />

              <div className="space-y-2">
                <div className="text-sm font-medium">Music Genres</div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full border-blue-600 px-4 py-1 text-blue-600"
                  >
                    R & B
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-full border-pink-500 px-4 py-1 text-pink-500"
                  >
                    Pop
                  </Badge>
                </div>
              </div>
              <DividerHorizontalIcon />

              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Similar Songs</div>
                <div className="text-sm">Sweet Life, Good Days</div>
              </div>
              <DividerHorizontalIcon />

              <div className="space-y-2">
                <div className="text-sm font-medium">Description</div>
                <div className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Mauris pharetra lacus sit
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <Link
              href="/scenes"
              className="flex items-center text-sm text-gray-500 hover:text-gray-900"
            >
              <ChevronLeftIcon className="mr-1 h-4 w-4" />
              Scenes
            </Link>
          </div>
        </div>

        {/* Right panel - Music selection */}
        <HydrateClient>
          <MusicSection params={params} />
        </HydrateClient>
      </div>
    </div>
  );
}
