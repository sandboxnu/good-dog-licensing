import ModeratorOnboarding from "@good-dog/components/registration/onboarding/ModeratorOnboarding";

interface PageProps {
  searchParams: {
    id?: string;
  };
}

export default function Page({ searchParams }: PageProps) {
  const moderatorInviteId = searchParams.id ?? "";

  return <ModeratorOnboarding moderatorInviteId={moderatorInviteId} />;
}
