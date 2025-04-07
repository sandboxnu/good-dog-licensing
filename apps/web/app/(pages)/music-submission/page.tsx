import React from "react";

import MusicSubmissionForm from "@good-dog/components/musicSubmission/MusicSubmissionForm";
import { trpc } from "@good-dog/trpc/server";

export default function MusicSubmissionPage() {
  void trpc.getMusicianGroup.prefetch();

  return <MusicSubmissionForm />;
}
