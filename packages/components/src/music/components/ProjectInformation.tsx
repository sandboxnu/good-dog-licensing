import type { User, ProjectSubmission } from ".prisma/client";
import { formatAllCapsList } from "../../../utils/allCapsListFormatter";

export default function ProjectInformation({
  projectSubmission,
  projectOwner,
}: {
  projectSubmission: ProjectSubmission | undefined;
  projectOwner: User | undefined;
}) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl border-[0.5px] border-light-gray shadow-md">
      <p className="text-xl text-gray-200 dark:text-gray-100">
        Project Information
      </p>
      <div className="flex flex-col gap-1">
        <p className="text-gray-200 dark:text-gray-100">Project Title</p>
        <p className="text-gray-200 dark:text-gray-100">
          {projectSubmission ? projectSubmission.projectTitle : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray-200 dark:text-gray-100">Project Deadline</p>
        <p className="text-gray-200 dark:text-gray-100">
          {projectSubmission?.deadline.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray-200 dark:text-gray-100">Media Maker</p>
        <p className="text-gray-200 dark:text-gray-100">
          {projectOwner
            ? projectOwner.firstName + " " + projectOwner.lastName
            : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray-200 dark:text-gray-100">Media Type</p>
        <p className="text-gray-200 dark:text-gray-100">
          {projectSubmission
            ? formatAllCapsList(projectSubmission.projectType.split("_"))
            : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray-200 dark:text-gray-100">Project Description</p>
        <p className="text-gray-200 dark:text-gray-100">
          {projectSubmission ? projectSubmission.description : "..."}
        </p>
      </div>
      {projectSubmission && projectSubmission.additionalInfo.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-gray-200 dark:text-gray-100">
            Additional Information
          </p>
          <p className="text-gray-200 dark:text-gray-100">
            {projectSubmission.additionalInfo}
          </p>
        </div>
      )}
    </div>
  );
}
