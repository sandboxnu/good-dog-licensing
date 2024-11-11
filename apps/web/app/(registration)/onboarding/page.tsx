import { OnboardingFormSwitcher } from "@good-dog/components/registration";
import { trpc } from "@good-dog/trpc/server";

export default async function Page() {
  const user = await trpc.user();

  if (!user || user.role !== "ONBOARDING") {
    return <p>Forbidden</p>;
  }

  return <OnboardingFormSwitcher {...user} />;
}
