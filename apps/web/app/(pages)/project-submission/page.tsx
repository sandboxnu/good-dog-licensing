import ProjectSubmissionWidget from "@good-dog/components/submit/project/ProjectSubmissionWidget";

export default function SubmissionForm() {
  return (
    <div className="flex min-h-screen justify-center bg-good-dog-cream text-white px-32 py-8">
      {<ProjectSubmissionWidget />}
    </div>
  );
}
