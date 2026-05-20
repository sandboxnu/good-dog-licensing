"use client";

import type { GalleryProject } from "@good-dog/db";

export default function ProjectCard({
  project,
  onOpenProject,
}: {
  project: GalleryProject;
  onOpenProject: (project: GalleryProject) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpenProject(project)}
      className="relative flex aspect-square w-full cursor-pointer items-end overflow-hidden rounded-3xl bg-light-gray p-[24px] text-left dark:bg-dark-gray-300"
      style={
        project.imageUrl
          ? {
              backgroundImage: `url(${project.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <p className="rounded-2xl bg-black/15 px-[16px] py-[10px] text-3xl font-semibold text-cream-100 backdrop-blur-md">
        {project.projectName}
      </p>
    </button>
  );
}
