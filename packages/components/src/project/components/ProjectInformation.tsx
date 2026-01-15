"use client";

import type { ProjectSubmission } from ".prisma/client";
import Button from "../../base/Button";
import { useRouter } from "next/navigation";

export default function ProjectInformation({
  project,
}: {
  project: ProjectSubmission;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-4xl font-medium text-dark-gray-500 dark:text-mint-300">Song requests</p>
        <p className="text-dark-gray-500 dark:text-gray-200">This is where you view and manage your song requests</p>
      </div>
      <div className="flex flex-row justify-between items-end">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-dark-gray-500 dark:text-gray-200">Project Title: {project.projectTitle}</p>
          <p className="text-dark-gray-500 dark:text-gray-200">
            Project deadline:{" "}
            {project.deadline.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-dark-gray-500 dark:text-gray-200">
            Project description: {project.description}
          </p>
          {project.additionalInfo.length > 0 && (
            <p className="text-dark-gray-500 dark:text-gray-200">
              Additional information: {project.additionalInfo}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <Button
            variant="contained"
            displayIcon="plus"
            size={"medium"}
            onClick={() =>
              router.push("/project/" + project.projectId + "/add-song-request")
            }
            label="Request"
          />
        </div>
      </div>
    </div>
  );
}
