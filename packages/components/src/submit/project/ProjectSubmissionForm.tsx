"use client";

import { useCallback, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zProjectSubmissionValues } from "@good-dog/trpc/schema";
import { Button } from "@good-dog/ui/button";
import { Form } from "@good-dog/ui/form";

import type { ProjectSubmissionFieldValues } from "./common";
import FinalProjSubmission from "./sections/FinalProjectDetails";
import ProjectOverview from "./sections/ProjectOverview";
import SceneSubmission from "./sections/SceneSubmission";

enum SubmitProjectFormSection {
  FIRST = "first",
  SCENE = "scene",
  LAST = "last",
}

export function ProjectSubmissionForm() {
  const submitProjectForm = useForm<ProjectSubmissionFieldValues>({
    resolver: zodResolver(zProjectSubmissionValues),
  });

  const submitProjectMutation = trpc.projectSubmission.useMutation();
  // TODO: handle success and error

  const [currentPage, setCurrentPage] = useState<SubmitProjectFormSection>(
    SubmitProjectFormSection.FIRST,
  );

  const FormSectionComponent = useMemo(() => {
    switch (currentPage) {
      case SubmitProjectFormSection.FIRST:
        return ProjectOverview;
      case SubmitProjectFormSection.SCENE:
        return SceneSubmission;
      case SubmitProjectFormSection.LAST:
        return FinalProjSubmission;
    }
  }, [currentPage]);

  const goBack = useCallback(() => {
    switch (currentPage) {
      case SubmitProjectFormSection.SCENE:
        setCurrentPage(SubmitProjectFormSection.FIRST);
        break;
      case SubmitProjectFormSection.LAST:
        setCurrentPage(SubmitProjectFormSection.SCENE);
        break;
    }
  }, [currentPage]);

  const goNext = useCallback(() => {
    switch (currentPage) {
      case SubmitProjectFormSection.FIRST:
        setCurrentPage(SubmitProjectFormSection.SCENE);
        break;
      case SubmitProjectFormSection.SCENE:
        setCurrentPage(SubmitProjectFormSection.LAST);
        break;
    }
  }, [currentPage]);

  const handleSubmit = submitProjectForm.handleSubmit((values) => {
    submitProjectMutation.mutate(values);
  });

  return (
    <Form {...submitProjectForm}>
      <form
        onSubmit={handleSubmit}
        className="container mx-auto flex-1 px-4 py-12"
      >
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-center text-4xl font-bold">Submission</h1>

          <h2 className="mb-6 text-2xl font-bold">Project</h2>

          <div className="mb-8 text-gray-300">
            <p>
              Need help finding a song from our catalog? Submit a brief and one
              of our curators will get back to you with suitable music from our
              library.
            </p>
            <p>The more specific you are, the better we can assist!</p>
          </div>

          <FormSectionComponent />

          <div>
            <div className="mt-12 flex justify-center">
              <Button
                type="button"
                disabled={currentPage === SubmitProjectFormSection.FIRST}
                onClick={goBack}
                className="rounded bg-white px-8 py-2 font-medium text-emerald-600 hover:bg-emerald-100 hover:text-emerald-600"
              >
                Back
              </Button>
              <Button
                type="button"
                disabled={currentPage === SubmitProjectFormSection.LAST}
                onClick={goNext}
                className="ml-4 rounded bg-white px-8 py-2 font-medium text-emerald-600 hover:bg-emerald-100 hover:text-emerald-600"
              >
                Next
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            className="mt-12 flex w-full justify-center rounded bg-white px-8 py-2 font-medium text-emerald-600 hover:bg-emerald-100 hover:text-emerald-600"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
