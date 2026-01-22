"use client";

import { useRouter } from "next/navigation";

import Button from "../../base/Button";

export default function Header({
  title,
  subtitle,
  requestPath,
  buttonContent,
}: {
  title: string;
  subtitle: string;
  requestPath: string;
  buttonContent: string;
}) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-row justify-between gap-[32px]">
      <div className="flex flex-col gap-[8px]">
        <h3 className="dark:text-mint-300">{title}</h3>
        <p className="text-body3 dark:text-gray-200">{subtitle}</p>
      </div>
      <div className="flex flex-row items-center gap-[16px]">
        <Button
          onClick={() => router.push(requestPath)}
          size={"medium"}
          variant={"contained"}
          label={buttonContent}
          displayIcon={"plus"}
        />
      </div>
    </div>
  );
}
