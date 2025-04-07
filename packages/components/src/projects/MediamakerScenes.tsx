"use client";

import Link from "next/link";
import { ChevronLeftIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { trpc } from "@good-dog/trpc/client";
import { Input } from "@good-dog/ui/input";

export default function MediamakerScenes({ projectId }: { projectId: string }) {
  const data = trpc.mediamakerScenes.useSuspenseQuery({
    projectId: projectId,
  });

  const projectScenes = data[0].scenes;
  return (
    <div className="min-h-screen bg-white">
      {/* Project Info and Search */}
      <main className="px-10 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Scenes</h1>
          </div>
          <div className="relative w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-4"
            />
          </div>
        </div>

        {/* Scenes Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {projectScenes.map((scene) => (
            <Link
              key={scene.sceneId}
              href={`/projects/${projectId}/scenes/${scene.sceneId}`}
              className="group block"
            >
              <div className="relative">
                <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-md bg-gray-200 transition-all group-hover:ring-2 group-hover:ring-gray-400">
                  <h3 className="text-center font-medium">
                    {scene.sceneTitle}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Back Button */}
      <footer className="fixed bottom-6 left-10">
        <Link
          href="/account"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span>Projects</span>
        </Link>
      </footer>
    </div>
  );
}
