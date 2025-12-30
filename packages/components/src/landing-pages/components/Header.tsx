"use client";

import { useRouter } from "next/navigation";

import Button from "../../base/Button";

export default function Header({
  title,
  subtitle,
  buttonPath,
  buttonLabel
}: {
  title: string;
  subtitle: string;
  buttonPath: string;
  buttonLabel: string;
}) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-row justify-between gap-[32px]">
      <div className="flex flex-col gap-[8px]">
        <h3>{title}</h3>
        <p className="text-body3">{subtitle}</p>
      </div>
      <div className="flex flex-row items-center gap-[16px]">
        <Button
          onClick={() => router.push(buttonPath)}
          size={"medium"}
          variant={"contained"}
          label={buttonLabel}
          displayIcon={"plus"}
        />
      </div>
    </div>
  );
}
