import Nav from "@good-dog/components/Nav";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

import { ClientWrapper } from "./ClientWrapper";

export const dynamic = "force-dynamic";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  void trpc.user.prefetch();

  return (
    <HydrateClient>
      <ClientWrapper>
        <div className="flex min-h-screen flex-col items-center justify-center bg-custom-gradient">
          <div className="flex w-full min-w-[1250px] max-w-[1500px] flex-col items-center justify-center px-[228px]">
            <Nav />
            {children}
          </div>
        </div>
        <div className="h-[100px] bg-good-dog-main" />
      </ClientWrapper>
    </HydrateClient>
  );
}
