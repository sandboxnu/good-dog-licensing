// import Footer from "@good-dog/components/Footer";
// import Nav from "@good-dog/components/Nav";
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
        {/* <Nav /> */}
        {children}
        {/* <Footer /> */}
      </ClientWrapper>
    </HydrateClient>
  );
}
