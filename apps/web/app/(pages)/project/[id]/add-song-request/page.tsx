"use client";

import PageContainer from "@good-dog/components/PageContainer";
import SongRequestSubmissionWidget from "@good-dog/components/submit/song-request/SongRequestSubmissionWidget";
import { useParams } from "next/navigation";

export default function SubmissionForm() {
  const params = useParams();
  const projectId = params.id as string;
  return (
    <PageContainer background="solid">
      <SongRequestSubmissionWidget projectId={projectId} />
    </PageContainer>
  );
}
