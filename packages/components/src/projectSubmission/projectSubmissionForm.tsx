"use client";

import React, { useState } from "react";

import FinalProjSubmission from "@good-dog/components/projectSubmission/finalProjSubmission";
import ProjectSubmission from "@good-dog/components/projectSubmission/projectSubmission";
import SceneSubmission from "@good-dog/components/projectSubmission/sceneSubmission";

enum VisibleComponent {
  FIRST = "first",
  SCENE = "scene",
  LAST = "last",
}

export default function ProjectSubmissionForm() {
  const [visibleComp, setVisibleComp] = useState<VisibleComponent>(
    VisibleComponent.FIRST,
  );

  if (visibleComp === VisibleComponent.FIRST) {
    return (
      <ProjectSubmission
        goNext={() => setVisibleComp(VisibleComponent.SCENE)}
      />
    );
  } else if (visibleComp === VisibleComponent.SCENE) {
    return (
      <SceneSubmission
        goNext={() => setVisibleComp(VisibleComponent.LAST)}
        goBack={() => setVisibleComp(VisibleComponent.FIRST)}
      />
    );
  } else {
    return (
      <FinalProjSubmission
        goBack={() => setVisibleComp(VisibleComponent.SCENE)}
      />
    );
  }
}
