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
      className={`p-[24px] w-[320px] h-[200px] bg-cream-100 rounded-3xl border-[0.5px] border-[cream-400] ${size === "small" ? "w-[320px]" : "w-[992px]"}`}
    >
      <div className="flex flex-col">
        <p className="text-body1">{title}</p>
        <p className="text-caption">{subheader}</p>
      </div>
      {children}
    </div>
  );
}
