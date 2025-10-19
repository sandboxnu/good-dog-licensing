export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-main-gradient px-[228px] min-w-[1250px]">{children}</div>
  );
}
