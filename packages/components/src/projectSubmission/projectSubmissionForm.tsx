"use client";

import React, { useState } from "react";

import FinalProjSubmission from "@good-dog/components/projectSubmission/finalProjSubmission";
import ProjectSubmission from "@good-dog/components/projectSubmission/projectSubmission";
import SceneSubmission from "@good-dog/components/projectSubmission/sceneSubmission";
import { trpc } from "@good-dog/trpc/client";

enum VisibleComponent {
  FIRST = "first",
  SCENE = "scene",
  LAST = "last",
}

type Scene = {
  sceneTitle: string;
  description: string;
  musicType: string;
  similarSongs: string;
  additionalInfo: string;
};

export default function ProjectSubmissionForm() {
  const [visibleComp, setVisibleComp] = useState<VisibleComponent>(
    VisibleComponent.FIRST,
  );

  const [projectInfo, setProjectInfo] = useState({
    projectTitle: "",
    description: "",
    deadline: "",
    videoLink: "",
    additionalInfo: "",
  });

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const [scenes, setScenes] = useState<Scene[]>([
    {
      sceneTitle: "",
      description: "",
      musicType: "",
      similarSongs: "",
      additionalInfo: "",
    },
  ]);

  const submitProject = trpc.projectSubmission.useMutation();

  const handleSubmit = async () => {
    try {
      await submitProject.mutateAsync({
        ...projectInfo,
        scenes,
      });
      alert("Project submitted!");
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  if (visibleComp === VisibleComponent.FIRST) {
    return (
      <ProjectSubmission
        goNext={() => {
          setVisibleComp(VisibleComponent.SCENE);
          setCurrentSceneIndex(0);
        }}
        data={projectInfo}
        setData={(newData) =>
          setProjectInfo((prev) => ({ ...prev, ...newData }))
        }
      />
    );
  } else if (visibleComp === VisibleComponent.SCENE) {
    return (
      <SceneSubmission
        sceneData={
          scenes[currentSceneIndex] || {
            sceneTitle: "",
            description: "",
            musicType: "",
            similarSongs: "",
            additionalInfo: "",
          }
        }
        setSceneData={(updatedScene) => {
          const updated = [...scenes];
          updated[currentSceneIndex] = updatedScene;
          setScenes(updated);
        }}
        goNext={() => {
          const hasNextScene = currentSceneIndex + 1 < scenes.length;
          if (hasNextScene) {
            setCurrentSceneIndex(currentSceneIndex + 1);
          } else {
            setVisibleComp(VisibleComponent.LAST);
          }
        }}
        onNewScene={() => {
          const newScene = {
            sceneTitle: "",
            description: "",
            musicType: "",
            similarSongs: "",
            additionalInfo: "",
          };
          setScenes([...scenes, newScene]);
          setCurrentSceneIndex(scenes.length);
        }}
        goBack={() => {
          if (currentSceneIndex > 0) {
            setCurrentSceneIndex(currentSceneIndex - 1);
          } else {
            setVisibleComp(VisibleComponent.FIRST);
          }
        }}
      />
    );
  } else {
    return (
      <FinalProjSubmission
        goBack={() => {
          setVisibleComp(VisibleComponent.SCENE);
          setCurrentSceneIndex(scenes.length - 1);
        }}
        onSubmit={handleSubmit}
        additionalInfo={projectInfo.additionalInfo}
        setAdditionalInfo={(info) =>
          setProjectInfo((prev) => ({ ...prev, additionalInfo: info }))
        }
      />
    );
  }
}
