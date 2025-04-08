import {
  ProjectSubmissionDatePicker,
  ProjectSubmissionInput,
  ProjectSubmissionTextarea,
} from "../common";

export default function ProjectOverview() {
  return (
    <div className="space-y-8">
      <ProjectSubmissionInput
        name="projectTitle"
        label="Project Name"
        placeholder="Your Project's Title"
        required
      />
      <ProjectSubmissionTextarea
        name="description"
        label="Project Description"
        placeholder="Your Project's Description"
        description="Please provide a brief description of your project."
        required
      />
      <ProjectSubmissionDatePicker
        name="deadline"
        label="Project Start Date"
        description="Please provide the date your project started."
      />
    </div>
  );
}
