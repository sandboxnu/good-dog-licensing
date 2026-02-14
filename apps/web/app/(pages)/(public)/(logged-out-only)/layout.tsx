import { trpc } from "@good-dog/trpc/server";
import { redirect } from "next/navigation";
import React from "react";

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
