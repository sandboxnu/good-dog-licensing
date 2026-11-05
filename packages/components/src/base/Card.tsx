import type { ReactNode } from "react";
import Link from "next/link";

export default function Card({
  size,
  title,
  subheader,
  href,
  children,
}: {
  size: "small" | "large";
  title: string;
  subheader: string;
  /** When set, the whole card is a link (easier to tap than a small icon) */
  href?: string;
  children: ReactNode;
}) {
  const className = `relative flex h-[200px] flex-col overflow-hidden rounded-3xl border-[0.5px] border-cream-500 bg-cream-100 p-[24px] dark:bg-green-600 ${size === "small" ? "w-full sm:w-[320px]" : "w-full max-w-[992px]"} ${href ? "transition-colors hover:border-green-300 dark:hover:border-mint-200" : ""}`;

  const content = (
    <>
      <div className="flex flex-col gap-[8px]">
        <p className="truncate text-body1 leading-[0.96] font-semibold text-dark-gray-500 dark:text-mint-300">
          {title}
        </p>
        <p className="truncate text-caption leading-[0.96] text-dark-gray-500 dark:text-gray-200">
          {subheader}
        </p>
      </div>

      {/* Wrap children in a flex-col container so text stays above indicator */}
      <div className="flex flex-1 flex-col gap-[24px]">{children}</div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
