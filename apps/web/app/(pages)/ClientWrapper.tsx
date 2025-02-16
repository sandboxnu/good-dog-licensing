"use client";

/**
 * This component is used to wrap the entire application with any client-side
 * hooks or components that need to be run on every page.
 */
export const ClientWrapper = (
  props: Readonly<{
    children: React.ReactNode;
  }>,
) => {
  return <>{props.children}</>;
};
