"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { trpc } from "@good-dog/trpc/client";

import DisplaySingleProject from "./DisplaySingleProject";

export default function DisplayProjects() {
  const projectsQuery = trpc.projects.useSuspenseQuery();
  const projects = projectsQuery[0].projects;

  const searchParams = useSearchParams();
  const displayedProjectId = searchParams.get("id");
  const displayedProject = projects.find(
    (project) => project.projectId === displayedProjectId,
  );

  return (
    <div className="px-[40px]">
      <div className="flex h-[45px] w-full bg-[#F1F5F9]">
        <div className="font-afacad flex w-1/4 items-center justify-start pl-[20px] text-lg font-normal text-black">
          Project Name
        </div>
        <div className="font-afacad flex w-1/4 items-center justify-start text-lg font-normal text-black">
          Media Maker
        </div>
        <div className="font-afacad flex w-1/4 items-center justify-start text-lg font-normal text-black">
          Date Submitted
        </div>
        <div className="font-afacad flex w-1/4 items-center justify-start text-lg font-normal text-black">
          Project Details
        </div>
      </div>
      <div className="h-[400px] overflow-auto">
        {projects.map((project) => {
          return (
            <div key={project.projectId} className="flex flex-col">
              <div className="flex h-[60px] w-full bg-white">
                <div className="font-afacad flex w-1/4 items-center justify-start pl-[20px] text-lg font-normal text-black">
                  {project.projectTitle}
                </div>
                <div className="font-afacad flex w-1/4 items-center justify-start text-lg font-normal text-black">
                  {project.projectOwner.firstName +
                    " " +
                    project.projectOwner.lastName}
                </div>
                <div className="font-afacad flex w-1/4 items-center justify-start text-lg font-normal text-black">
                  {project.createdAtDateString}
                </div>
                <div className="font-afacad flex w-1/4 items-center justify-start text-lg font-normal text-black">
                  <Link
                    href={`/dashboard/projects?id=${project.projectId}`}
                    className="font-afacad rounded-xl border border-[#A3A3A3] bg-[#A3A3A382] p-[4px] text-lg font-normal text-black"
                  >
                    Project Link
                  </Link>
                </div>
              </div>
              <div className="h-[1px] w-full bg-[#D7D8D9]"></div>
            </div>
          );
        })}
      </div>
      {displayedProject && (
        <DisplaySingleProject
          projectName={displayedProject.projectTitle}
          dateSubmitted={displayedProject.createdAtDateString}
          projectDeadline={displayedProject.createdAtDateString}
          projectDescription={displayedProject.description}
          projectAdditionalInfo={displayedProject.additionalInfo}
          projectScenes={displayedProject.scenes.map((scene) => {
            return { sceneName: scene.sceneTitle, sceneId: scene.sceneId };
          })}
        />
      )}
    </div>
  );
}
