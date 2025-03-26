import { forbidden } from "next/navigation";

import type { GoodDogPermissionsFactory } from "@good-dog/auth/permissions";
import type { Role } from "@good-dog/db";
import {
  getServerQueryClient,
  HydrateClient,
  trpc,
} from "@good-dog/trpc/server";

const getTrpcLikeQueryKey = <I extends object>(path: string[], input?: I) => [
  path.flatMap((part) => part.split(".")),
  {
    type: "query",
    ...(input ? { input } : {}),
  },
];

export const layoutWithPermissions = <
  Read extends Role,
  Write extends Role,
  LayoutProps extends {
    params?: Promise<Record<string, string | string[] | undefined>>;
    children?: React.ReactNode;
  },
>(
  permissions: GoodDogPermissionsFactory<Read, Write>,
  LayoutComponent: React.ComponentType<LayoutProps> = ({ children }) =>
    children,
) =>
  async function Layout(props: LayoutProps) {
    const user = await trpc.authenticatedUser();

    if (!permissions.canRead(user.role)) {
      forbidden();
    }

    const serverQueryClient = getServerQueryClient();
    serverQueryClient.setQueryData(getTrpcLikeQueryKey(["user"]), user);
    serverQueryClient.setQueryData(
      getTrpcLikeQueryKey(["authenticatedUser"]),
      user,
    );

    return (
      <HydrateClient>
        <LayoutComponent {...props} />
      </HydrateClient>
    );
  };
