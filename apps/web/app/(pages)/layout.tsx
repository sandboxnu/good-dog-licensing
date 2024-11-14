import Footer from "@good-dog/components/Footer";
import Nav from "@good-dog/components/Nav";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
