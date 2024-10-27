import { TRPCProvider } from "@good-dog/trpc/client";

import "./globals.css";

import Footer from "@good-dog/components/Footer";
import Nav from "@good-dog/components/Nav";

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
          <Nav />
          {children}
          <Footer />
        </TRPCProvider>
      </body>
    </html>
  );
}
