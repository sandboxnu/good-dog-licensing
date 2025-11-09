import { TRPCProvider } from "@good-dog/trpc/client";

import "@good-dog/tailwind/styles";
import { HydrateClient, trpc } from "@good-dog/trpc/server";
import { ClientWrapper } from "./ClientWrapper";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Good Dog Licensing",
  description: "Coming soon...",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  void trpc.user.prefetch();

  return (
    <html lang="en">
      <body>
        <TRPCProvider>
          <HydrateClient>
            <ClientWrapper>{children}</ClientWrapper>
          </HydrateClient>
        </TRPCProvider>
      </body>
    </html>
  );
}
