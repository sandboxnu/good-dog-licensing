import { OnboardingForm } from "@good-dog/components/registration";
import { trpc } from "@good-dog/trpc/server";

// Necessary to access cookies
export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await trpc.user();

  // if (!user || user.role !== "ONBOARDING") {
  //   return <p>Forbidden</p>;
  // }

  return <OnboardingForm {...user} />;
}
