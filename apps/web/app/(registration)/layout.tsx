export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-w-[1250px] px-[228px]">{children}</div>;
}
