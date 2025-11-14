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
      className={`relative p-[24px] w-[320px] h-[200px] bg-cream-100 rounded-3xl border-[0.5px] border-[cream-400] overflow-hidden
    ${size === "small" ? "w-[320px]" : "w-[992px]"}`}
    >
      <div className="flex flex-col gap-[8px]">
        <p className="text-body1 font-semibold leading-[0.96]">{title}</p>
        <p className="text-caption leading-[0.96]">{subheader}</p>
      </div>

      {/* Wrap children in a flex-col container so text stays above indicator */}
      <div className="flex flex-col h-full pt-[16px] gap-[24px]">
        {children}
      </div>
    </div>
  );
}
