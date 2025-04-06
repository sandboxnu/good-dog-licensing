"use client";

import Link from "next/link";
import { ChevronLeftIcon, DividerHorizontalIcon } from "@radix-ui/react-icons";

import { trpc } from "@good-dog/trpc/client";
import { Badge } from "@good-dog/ui/badge";

export default function SceneSection({
  projectId,
  sceneId,
}: {
  projectId: string;
  sceneId: string;
}) {
  const data = trpc.scene.useSuspenseQuery({
    projectId: projectId,
    sceneId: sceneId,
  });

  const sceneInfo = data[0];

  return (
    <div className="flex w-full flex-col p-6 md:w-1/2 md:p-10">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{sceneInfo.sceneTitle}</h1>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Scene Added</div>
            <div className="text-sm">
              {sceneInfo.createdAt.toISOString().toString().substring(0, 10)}
            </div>
          </div>
          <DividerHorizontalIcon />

          <div className="space-y-2">
            <div className="text-sm font-medium">Music Type</div>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className="rounded-full border-blue-600 px-4 py-1 text-blue-600"
              >
                {sceneInfo.musicType}
              </Badge>
            </div>
          </div>
          <DividerHorizontalIcon />

          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Similar Songs</div>
            <div className="text-sm">{sceneInfo.similarSongs}</div>
          </div>
          <DividerHorizontalIcon />

          <div className="space-y-2">
            <div className="text-sm font-medium">Description</div>
            <div className="text-sm">{sceneInfo.description}</div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Link
          href={`/projects/${projectId}`}
          className="flex items-center text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeftIcon className="mr-1 h-4 w-4" />
          Scenes
        </Link>
      </div>
    </div>
  );
}
