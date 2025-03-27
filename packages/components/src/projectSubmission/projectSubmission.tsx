import { Input } from "@good-dog/components/input";
import { Textarea } from "@good-dog/components/textarea";
import { Button } from "@good-dog/ui/button";

export default function ProjectSubmission() {
  return (
    <main className="container mx-auto flex-1 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-center text-4xl font-bold">Submission</h1>

        <div className="mb-8 text-center">
          <p className="mb-2 text-gray-300">
            You are submitting for [Band Name]
          </p>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800 text-white hover:bg-zinc-700 hover:text-white"
          >
            Change
          </Button>
        </div>

        <h2 className="mb-6 text-2xl font-bold">Project</h2>

        <div className="mb-8 text-gray-300">
          <p>
            Need help finding a song from our catalog? Submit a brief and one of
            our curators will get back to you with suitable music from our
            library.
          </p>
          <p>The more specific you are, the better we can assist!</p>
        </div>

        <div className="mb-8">
          <p className="text-red-500">* Indicates a required question.</p>
        </div>

        <form className="space-y-8">
          <div className="space-y-2">
            <label htmlFor="project-name" className="block font-medium">
              Project Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="project-name"
              placeholder="Your Answer"
              required
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="project-description" className="block font-medium">
              Project Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="project-description"
              placeholder="Your Answer"
              required
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="project-deadline" className="block font-medium">
              Project Deadline <span className="text-red-500">*</span>
            </label>
            <Input
              id="project-deadline"
              placeholder="mm/dd/yy"
              required
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="mt-12 flex justify-center">
            <Button className="rounded bg-white px-8 py-2 font-medium text-emerald-600 hover:bg-emerald-100 hover:text-emerald-600">
              Next
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
