import Nav from "@good-dog/components/Nav";
import Footer from "@good-dog/components/Footer";
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-custom-gradient">
          <div className="px-[228px] min-w-[1250px] max-w-[1500px] w-full flex flex-col justify-center items-center">
            <Nav />
            {children}
          </div>
          <Footer />
        </div>
      </ClientWrapper>
    </HydrateClient>
  );
}
