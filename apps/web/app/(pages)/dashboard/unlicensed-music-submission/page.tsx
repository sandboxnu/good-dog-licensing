//import { UnlicensedMusicSubmissionForm } from "@good-dog/components/registration";
import UnlicensedMusicSubmissionForm from "@good-dog/components/dashboard/UnlicensedMusicSubmissionForm";
import { trpc } from "@good-dog/trpc/server";

// Necessary to access cookies
export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await trpc.user();

  if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
    return <p>Forbidden {user?.role}</p>;
  }

  return <UnlicensedMusicSubmissionForm />;
}
