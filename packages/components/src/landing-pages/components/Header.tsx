export default function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="w-full flex flex-row gap-[32px] justify-between">
      <div className="flex flex-col gap-[8px]">
        <h3>{title}</h3>
        <p className="text-caption">{subtitle}</p>
      </div>
    </div>
  );
}
