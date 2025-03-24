import { forbidden } from "next/navigation";

import type { GoodDogPermissionsFactory } from "@good-dog/auth/permissions";
import type { Role } from "@good-dog/db";
import type { UserWithSession } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/server";

export const withPermissions =
  <Read extends Role, Write extends Role, PageProps>(
    permissions: GoodDogPermissionsFactory<Read, Write>,
    PageComponent: React.ComponentType<
      PageProps & {
        user: UserWithSession | null;
      }
    >,
  ) =>
  async (props: PageProps) => {
    const user = await trpc.user();

    if (!permissions.canRead(user?.role)) {
      forbidden();
    }

    return <PageComponent {...props} user={user} />;
  };
