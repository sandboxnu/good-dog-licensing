import Footer from "@good-dog/components/Footer";
import Nav from "@good-dog/components/Nav";

// import { HydrateClient, trpc } from "@good-dog/trpc/server";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // void trpc.user.prefetch();

  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
