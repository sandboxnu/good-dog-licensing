"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@good-dog/ui/button";

import { ProjectSubmissionInput, ProjectSubmissionTextarea } from "../common";

export default function SceneSubmission() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const fieldNamePrefix = `scenes.${currentSceneIndex}` as const;

  // TODO: add a select to choose which scene to edit, and a button to remove the scene

  return (
    <div className="space-y-8">
      <ProjectSubmissionInput
        name={`${fieldNamePrefix}.sceneTitle`}
        label="Scene Title"
        placeholder="The tile of the Scene"
        required
      />
      <ProjectSubmissionTextarea
        name={`${fieldNamePrefix}.description`}
        label="Scene Description"
        placeholder="Your Answer"
        description="Please provide a brief description of your scene."
        required
      />
      <ProjectSubmissionTextarea
        name={`${fieldNamePrefix}.musicType`}
        label="Scene Description"
        placeholder="Your Answer"
        description="Please provide a brief description of your scene."
        required
      />
      <ProjectSubmissionInput
        name={`${fieldNamePrefix}.similarSongs`}
        label="List Example Artists, Tracks, Songs, Eras, or Instrumentals"
        placeholder="Your Answer"
        required
      />
      <ProjectSubmissionInput
        name={`${fieldNamePrefix}.additionalInfo`}
        label="Additional Information"
        placeholder="Your Answer"
        description="Please provide any additional information about your scene."
      />

      <div className="mt-12 flex justify-center">
        <Button
          type="button"
          onClick={() => {
            setCurrentSceneIndex((prev) => prev + 1);
          }}
          className="rounded bg-white px-8 py-2 font-medium text-emerald-600 hover:bg-emerald-100 hover:text-emerald-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Scene
        </Button>
      </div>
    </div>
  );
}
