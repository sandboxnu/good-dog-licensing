"use client";

export function TableRowFormatting({
  isLast,
  children,
  columnCount = 7,
}: {
  isLast: boolean;
  children: React.ReactNode;
  columnCount?: number;
}) {
  return (
    <div
      className={`p-[16px] bg-white gap-4 border-[0.2px] border-t-0 border-solid border-cream-400 items-center ${isLast ? "rounded-b-[8px]" : ""}`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
      }}
    >
      {children}
    </div>
  );
}

export function TableHeaderFormatting({
  children,
  columnCount = 7,
}: {
  children: React.ReactNode;
  columnCount?: number;
}) {
  return (
    <div
      className="p-[16px] bg-cream-100 rounded-t-[8px] gap-4 border-[0.2px] border-solid border-cream-400 items-center"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
      }}
    >
      {children}
    </div>
  );
}

export function TableOuterFormatting({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="pt-[32px] pr-[24px] pl-[24px] pb-[48px] flex flex-col gap-[24px] self-stretch rounded-[24px] bg-gray-100 dark:bg-dark-gray-600 shadow-[0_2px_6px_0_#ECE6DF]
"
    >
      {children}
    </div>
  );
}
