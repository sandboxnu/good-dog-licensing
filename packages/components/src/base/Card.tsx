import type { ReactNode } from "react";

export default function Card({
  size,
  title,
  subheader,
  children,
}: {
  size: "small" | "large";
  title: string;
  subheader: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative h-[200px] w-[320px] overflow-hidden rounded-3xl border-[0.5px] border-cream-400 bg-cream-100 dark:bg-green-500 p-[24px] ${size === "small" ? "w-[320px]" : "w-[992px]"}`}
    >
      <div className="flex flex-col gap-[8px]">
        <p className="text-body1 font-semibold leading-[0.96] text-dark-gray-500 dark:text-mint-300">{title}</p>
        <p className="text-caption leading-[0.96] text-dark-gray-500 dark:text-gray-200">{subheader}</p>
      </div>

      {/* Wrap children in a flex-col container so text stays above indicator */}
      <div className="flex flex-col gap-[24px] pt-[16px]">{children}</div>
    </div>
  );
}
