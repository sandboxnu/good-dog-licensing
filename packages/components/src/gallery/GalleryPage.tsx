"use client";

import { useState } from "react";

import type { GalleryProject } from "@good-dog/db";

import Button from "../base/Button";
import AddProjectModal from "./AddProjectModal";
import FeaturedCard from "./FeaturedCard";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

export default function GalleryPage({
  isAdmin,
  featured,
  projects,
}: {
  isAdmin: boolean;
  featured: GalleryProject[];
  projects: GalleryProject[];
}) {
  const [openProject, setOpenProject] = useState<GalleryProject | null>(null);
  const [addProjectOpen, setAddProjectOpen] = useState(false);

  return (
    <div className="flex w-3/4 flex-col gap-[48px] pb-[100px]">
      <div className="flex flex-col gap-[12px]">
        <div className="flex flex-row items-center justify-between">
          <p className="text-5xl text-dark-gray-500 dark:text-mint-300">
            Gallery
          </p>
          {isAdmin && (
            <Button
              size={"medium"}
              variant={"contained"}
              displayIcon="plus"
              label="Add project"
              onClick={() => setAddProjectOpen(true)}
            />
          )}
        </div>
        <p className="text-lg text-dark-gray-500 dark:text-gray-200">
          Good Dog Licensing connects creatives by providing a legal framework
          for media producers to source high quality music from independent
          artists for their media projects. Good Dog Licensing connects
          independent media makers.
        </p>
      </div>

      <div className="flex flex-col gap-[24px]">
        <p className="text-4xl text-dark-gray-500 dark:text-mint-300">
          Recent projects
        </p>

        <FeaturedCard
          projects={featured}
          paused={openProject !== null}
          onOpenProject={setOpenProject}
        />
      </div>

      <div className="grid grid-cols-3 gap-[24px]">
        {projects.map((project) => (
          <ProjectCard
            key={project.galleryProjectId}
            project={project}
            onOpenProject={setOpenProject}
          />
        ))}
      </div>

      <ProjectModal
        project={openProject}
        onClose={() => setOpenProject(null)}
      />

      <AddProjectModal
        open={addProjectOpen}
        onClose={() => setAddProjectOpen(false)}
      />
    </div>
  );
}
