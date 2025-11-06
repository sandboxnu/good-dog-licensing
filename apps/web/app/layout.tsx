import { TRPCProvider } from "@good-dog/trpc/client";

import SentryInitClient from "../sentry-init-client";

import "@good-dog/tailwind/styles";

export const metadata = {
  title: "Good Dog Licensing",
  description: "Coming soon...",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-background">
        <TRPCProvider>{children}</TRPCProvider>
        <SentryInitClient>{children}</SentryInitClient>
      </body>
    </html>
  );
}
