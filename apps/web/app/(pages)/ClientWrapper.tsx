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
  useSessionRefresh();

  return <>{props.children}</>;
};

/**
 * Due to limitations in Next.js, we can't use set cookies during page load.
 * So, we need to refresh the session manually with a POST request.
 *
 * This component will automatically refresh the session if the session is
 * marked as `refreshRequired`.
 */
const useSessionRefresh = () => {
  const [user, userQuery] = trpc.user.useSuspenseQuery();
  const refreshSessionMutation = trpc.refreshSession.useMutation({
    onSuccess: () => {
      void userQuery.refetch();
    },
  });

  useEffect(() => {
    if (user?.session.refreshRequired && !refreshSessionMutation.isPending) {
      refreshSessionMutation.mutate();
    }
  }, [user?.session, refreshSessionMutation]);
};
