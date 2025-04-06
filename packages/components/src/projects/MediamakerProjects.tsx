import Link from "next/link";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { Card } from "@good-dog/ui/card";

interface MediamakerProjectsProps {
  data: GetProcedureOutput<"mediamakerProjects">["projects"];
}

export default function MediamakerProjects({ data }: MediamakerProjectsProps) {
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
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
