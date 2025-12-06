import type { User, ProjectSubmission } from ".prisma/client";

export default function ProjectInformation({
  projectSubmission,
  projectOwner,
}: {
  projectSubmission: ProjectSubmission | undefined;
  projectOwner: User | undefined;
}) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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
          {projectSubmission
            ? monthNames[projectSubmission.deadline.getMonth()] +
              " " +
              projectSubmission.deadline.getDate().toString() +
              ", " +
              projectSubmission.deadline.getFullYear().toString()
            : "..."}
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
            ? projectSubmission.projectType
                .split("_")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
                )
                .join(" ")
            : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Project Description</p>
        <p>{projectSubmission ? projectSubmission.description : "..."}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Additional Information</p>
        <p>{projectSubmission ? projectSubmission.additionalInfo : "..."}</p>
      </div>
    </div>
  );
}
