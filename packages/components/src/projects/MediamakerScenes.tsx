import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

// import { trpc } from "@good-dog/trpc/client";
import { Input } from "@good-dog/ui/input";

// Fake data for the project
const projectData = {
  id: "proj-123",
  name: "Cosmic Odyssey",
  creator: "Media Vision Studios",
  scenes: [
    { id: "scene-1", name: "Space Station Arrival", notifications: 1 },
    { id: "scene-2", name: "Alien Encounter", notifications: 0 },
    { id: "scene-3", name: "Nebula Exploration", notifications: 0 },
    { id: "scene-4", name: "Quantum Portal", notifications: 0 },
    { id: "scene-5", name: "Asteroid Field", notifications: 0 },
    { id: "scene-6", name: "Galactic Council", notifications: 1 },
    { id: "scene-7", name: "Wormhole Transit", notifications: 0 },
    { id: "scene-8", name: "Planet Landing", notifications: 0 },
  ],
};

export default function MediamakerScenes({
  params,
}: {
  params: { projectId: string };
}) {
  // const data = trpc.mediamakerScenes.useSuspenseQuery({
  //   projectId: params.projectId,
  // });
  return (
    <div className="min-h-screen bg-white">
      {/* Project Info and Search */}
      <main className="px-10 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Scenes</h1>
            {/* <h1 className="text-2xl font-bold">{projectData.name}</h1>
            <p className="text-gray-500">{projectData.creator}</p> */}
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
          {projectData.scenes.map((scene) => (
            <Link
              key={scene.id}
              href={`/projects/${params.projectId}/scenes/${scene.id}`}
              className="group block"
            >
              <div className="relative">
                <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-200 transition-all group-hover:ring-2 group-hover:ring-gray-400">
                  <Image
                    src={`/placeholder.svg?height=180&width=320&text=${scene.name}`}
                    alt={scene.name}
                    width={320}
                    height={180}
                    className="h-full w-full object-cover"
                  />
                </div>
                {scene.notifications > 0 && (
                  <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                    {scene.notifications}
                  </div>
                )}
              </div>
              <h3 className="mt-2 text-center font-medium">{scene.name}</h3>
            </Link>
          ))}
        </div>
      </main>

      {/* Back Button */}
      <footer className="fixed bottom-6 left-10">
        <Link
          href="/projects"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span>Projects</span>
        </Link>
      </footer>
    </div>
  );
}
