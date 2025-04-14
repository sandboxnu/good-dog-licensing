"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@good-dog/ui/button";

import type { ProjectSubmissionFieldValues } from "../common";
import { ProjectSubmissionInput, ProjectSubmissionTextarea } from "../common";

export default function SceneSubmission() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const fieldNamePrefix = `scenes.${currentSceneIndex}` as const;

  const { control } = useFormContext<ProjectSubmissionFieldValues>();
  const { fields, append } = useFieldArray({ control, name: "scenes" });

  // TODO: add a button to remove the scene

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

      <div className="mt-12 space-y-2">
        <div>
          {fields.map((scene, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSceneIndex(index)}
              className={`mr-2 rounded px-4 py-2 ${
                currentSceneIndex === index
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {scene.sceneTitle || `Scene ${index + 1}`}
            </button>
          ))}
        </div>
        <Button
          type="button"
          onClick={() => {
            append({
              sceneTitle: "",
              description: "",
              musicType: "",
              similarSongs: "",
              additionalInfo: "",
            });
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
