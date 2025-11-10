"use client";
import Button from "../../base/Button";
import { useRouter } from "next/navigation";

export default function Header({
  title,
  subtitle,
  requestPath,
}: {
  title: string;
  subtitle: string;
  requestPath: string;
}) {
  const router = useRouter();

  return (
    <div className="w-full flex flex-row gap-[32px] justify-between">
      <div className="flex flex-col gap-[8px]">
        <h3>{title}</h3>
        <p className="text-body3">{subtitle}</p>
      </div>
      <div className="flex flex-row gap-[16px] items-center">
        <Button
          onClick={() => router.push(requestPath)}
          size={"medium"}
          variant={"contained"}
          label={"Request"}
          displayIcon={"plus"}
        />
      </div>
    </div>
  );
}
