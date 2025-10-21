export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="px-[228px] min-w-[1250px]">{children}</div>;
}
