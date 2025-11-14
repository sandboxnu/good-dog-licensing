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
    <div className="flex flex-col w-full justify-center items-center gap-[24px] pt-[152px]">
      {icon}
      <div className="flex flex-col gap-[16px] w-[464px] text-center">
        <h3>{title}</h3>
        <p className="text-body1 text-dark-gray-200 dark:text-dark-gray-100">
          {description}
        </p>
      </div>
    </div>
  );
}
