import InviteModerator from "@good-dog/components/admin/InviteModerator";
import { trpc } from "@good-dog/trpc/server";

export default async function Page() {
  const user = await trpc.user();

  if (!user || user.role != "ADMIN") {
    return <p>Forbidden</p>;
  }

  return <InviteModerator></InviteModerator>;
}
