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
      <p className="text-xl text-gray">Project Information</p>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Project Title</p>
        <p>{projectSubmission ? projectSubmission.projectTitle : "..."}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Project Deadline</p>
        <p>
          {projectSubmission?.deadline.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Media Maker</p>
        <p>
          {projectOwner
            ? projectOwner.firstName + " " + projectOwner.lastName
            : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Media Type</p>
        <p>
          {projectSubmission
            ? formatAllCapsList(projectSubmission.projectType.split("_"))
            : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Project Description</p>
        <p>{projectSubmission ? projectSubmission.description : "..."}</p>
      </div>
      {projectSubmission && projectSubmission.additionalInfo.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-gray">Additional Information</p>
          <p>{projectSubmission.additionalInfo}</p>
        </div>
      )}
    </div>
  );
}
