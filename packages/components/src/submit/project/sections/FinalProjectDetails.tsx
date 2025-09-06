"use client";

import React from "react";

import { ProjectSubmissionTextarea } from "../common";

export default function FinalProjectDetails() {
  return (
    <ProjectSubmissionTextarea
      name="additionalInfo"
      label="Additional Information"
      placeholder="Your Answer"
      description="Please provide any additional information about your project."
    />
  );
}
