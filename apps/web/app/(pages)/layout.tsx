import { HydrateClient, trpc } from "@good-dog/trpc/server";

import { ClientWrapper } from "./ClientWrapper";

export const dynamic = "force-dynamic";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  void trpc.user.prefetch();

  return (
    <HydrateClient>
      <ClientWrapper>{children}</ClientWrapper>
    </HydrateClient>
  );
}
