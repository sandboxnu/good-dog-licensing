import Link from "next/link";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { Card } from "@good-dog/ui/card";

// interface Project {
//   id: string;
//   name: string;
//   date: string;
//   notifications?: number;
// }

interface MediamakerProjectsProps {
  data: GetProcedureOutput<"mediamakerProjects">["projects"];
}

export default function MediamakerProjects({ data }: MediamakerProjectsProps) {
  // const pendingProjects: Project[] = [
  //   {
  //     id: "1",
  //     name: "Project Name",
  //     date: "Last updated: 2/13/25",
  //     notifications: 2,
  //   },
  //   {
  //     id: "2",
  //     name: "Project Name",
  //     date: "Last updated: 2/13/25",
  //     notifications: 0,
  //   },
  //   {
  //     id: "4",
  //     name: "Project Name",
  //     date: "Last updated: 2/13/25",
  //     notifications: 16,
  //   },
  //   {
  //     id: "5",
  //     name: "Project Name",
  //     date: "Last updated: 2/13/25",
  //     notifications: 100,
  //   },
  // ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 md:px-8">
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Projects</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {data.map((project) => (
            <Link
              href={`/projects/${project.projectId}`}
              key={project.projectId}
            >
              <Card className="relative cursor-pointer rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                <div className="flex flex-col">
                  <h3 className="font-medium text-gray-900">
                    {project.projectTitle}
                  </h3>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </div>
                {/* {project.notifications !== undefined && (
                  <Badge
                    className={`absolute right-5 top-7 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      project.notifications === 0
                        ? "bg-gray-400 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {project.notifications}
                  </Badge>
                )} */}
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
