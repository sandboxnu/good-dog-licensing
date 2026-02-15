import { TRPCProvider } from "@good-dog/trpc/client";

import "@good-dog/tailwind/styles";

import { HydrateClient, trpc } from "@good-dog/trpc/server";

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
          }
        `,
          }}
        />
      </head>
      <body>
        <TRPCProvider>
          <HydrateClient>{children}</HydrateClient>
        </TRPCProvider>
      </body>
    </html>
  );
}
