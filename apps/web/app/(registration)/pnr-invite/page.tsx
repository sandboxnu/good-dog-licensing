import ModeratorOnboarding from "@good-dog/components/registration/onboarding/ModeratorOnboarding";

export default function Page({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const moderatorInviteId = searchParams.id ?? "";

  return <ModeratorOnboarding moderatorInviteId={moderatorInviteId} />;
}
