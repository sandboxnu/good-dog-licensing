import type { UseSuspenseQueryResult } from "@tanstack/react-query";
import type { TRPCHookResult } from "@trpc/react-query/shared";

import type { UserWithSession } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";

/**
 * This hook is used to get the authenticated user from the server.
 * It should throw an error if the user is not authenticated.
 *
 * This hook is meant to be used inside a restricted route, and under normal
 * circumstances the error should never be thrown.
 *
 * Use the standard `trpc.user.useQuery` hook if you want to allow non-authenticated
 * users to access the route.
 */
export const useAuthenticatedUserSuspense = (
  onUnauthenticated: () => never = () => {
    throw new Error("User is not authenticated");
  },
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
