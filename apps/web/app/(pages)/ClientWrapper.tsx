"use client";

import { useEffect } from "react";

import { trpc } from "@good-dog/trpc/client";

/**
 * This component is used to wrap the entire application with any client-side
 * hooks or components that need to be run on every page.
 */
export const ClientWrapper = (
  props: Readonly<{
    children: React.ReactNode;
  }>,
) => {
  // useSessionRefresh();

  return <>{props.children}</>;
};

/**
 * Due to limitations in the Next.js rendering engine, we can't set cookies during page load.
 *
 * That means we need shouldn't set any cookies in tRPC *queries*, and instead should use *mutations*
 * which will never be run at render time.
 *
 * This component will automatically refresh the session if the session is
 * marked as `refreshRequired`, as determined by the server.
 */
const useSessionRefresh = () => {
  const [user] = trpc.user.useSuspenseQuery();
  const tUtils = trpc.useUtils();
  const refreshSessionMutation = trpc.refreshSession.useMutation({
    onSuccess: (response) => {
      // Override the session with the new session data *if* there is already existing session data
      tUtils.user.setData(undefined, (old) => (old ? response.user : old));
      tUtils.authenticatedUser.setData(undefined, (old) =>
        old ? response.user : old,
      );
    },
  });

  useEffect(() => {
    if (user?.session.refreshRequired && !refreshSessionMutation.isPending) {
      refreshSessionMutation.mutate();
    }
  }, [user?.session, refreshSessionMutation]);
};
