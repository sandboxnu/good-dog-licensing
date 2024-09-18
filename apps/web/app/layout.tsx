import "./globals.css";

export const metadata = {
  title: "Good Dog Licensing",
  description: "Coming soon...",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
