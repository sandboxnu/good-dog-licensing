"use client";

import { trpc } from "@good-dog/trpc/client";

export const User = () => {
  const userQuery = trpc.user.useQuery();

  if (userQuery.isError) {
    return <div>Error loading user</div>;
  }

  if (userQuery.isPending) {
    return <div>Loading user...</div>;
  }

  return (
    <div>
      <h1>Welcome back, {userQuery.data.name}</h1>
    </div>
  );
};
