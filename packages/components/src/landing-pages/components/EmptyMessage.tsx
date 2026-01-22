import type { ReactNode } from "react";

export default function EmptyMessage({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-[24px] pt-[152px]">
      {icon}
      <div className="flex w-[464px] flex-col gap-[16px] text-center">
        <h3 className="dark:text-mint-300">{title}</h3>
        <p className="text-body1 text-dark-gray-200 dark:text-dark-gray-100">
          {description}
        </p>
      </div>
    </div>
  );
}
