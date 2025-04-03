import type { UseSuspenseQueryResult } from "@tanstack/react-query";
import type { TRPCHookResult } from "@trpc/react-query/shared";

import type { UserWithSession } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";

export const useAuthenticatedUserSuspense = (
  onUnauthenticated: () => never,
  ...args: Parameters<typeof trpc.user.useSuspenseQuery<UserWithSession | null>>
) => {
  const userSuspenseQuery = trpc.user.useSuspenseQuery<UserWithSession | null>(
    ...args,
  );
  if (userSuspenseQuery[0] === null) {
    onUnauthenticated();
  }

  return userSuspenseQuery as [
    UserWithSession,
    UseSuspenseQueryResult<UserWithSession> & TRPCHookResult,
  ];
};
