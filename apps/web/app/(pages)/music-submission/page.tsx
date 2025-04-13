import React from "react";

import { MusicSubmissionForm } from "@good-dog/components/submit/MusicSubmissionForm";
import { trpc } from "@good-dog/trpc/server";

export default function MusicSubmissionPage() {
  void trpc.usersMusicianGroups.prefetch();

  return <MusicSubmissionForm />;
}
