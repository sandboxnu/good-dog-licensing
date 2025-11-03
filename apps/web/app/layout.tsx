import { TRPCProvider } from "@good-dog/trpc/client";

import "@good-dog/tailwind/styles";
import { HydrateClient } from "@good-dog/trpc/server";
import { ClientWrapper } from "./ClientWrapper";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Good Dog Licensing",
  description: "Coming soon...",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
