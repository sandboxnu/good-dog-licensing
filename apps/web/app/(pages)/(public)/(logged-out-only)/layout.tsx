import React from "react";
import { redirect } from "next/navigation";

import { trpc } from "@good-dog/trpc/server";

export default async function RedirectLoggedInUsersHome({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await trpc.user();

  if (user) {
    redirect("/home");
  }

  return <>{children}</>;
}
