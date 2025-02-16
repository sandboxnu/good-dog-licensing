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
