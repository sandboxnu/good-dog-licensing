"use client";

import SearchingMan from "../../../svg/homepage/admin/SearchingMan";

export function TableRowFormatting({
  isLast,
  children,
  columnCount,
}: {
  isLast: boolean;
  children: React.ReactNode;
  columnCount: number;
}) {
  return (
    <div
      className={`items-center gap-4 border-[0.2px] border-t-0 border-solid border-cream-400 bg-white p-[16px] dark:bg-dark-gray-600 ${isLast ? "rounded-b-[8px]" : ""}`}
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
  columnCount,
}: {
  children: React.ReactNode;
  columnCount: number;
}) {
  return (
    <div
      className="items-center gap-4 rounded-t-[8px] border-[0.2px] border-solid border-cream-400 bg-cream-100 p-[16px] dark:bg-dark-gray-600"
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
    <div className="flex flex-col gap-[24px] self-stretch rounded-[24px] bg-gray-100 pb-[48px] pl-[24px] pr-[24px] pt-[32px] shadow-card-light dark:bg-dark-gray-600">
      {children}
    </div>
  );
}

export function TableEmptyMessage() {
  return (
    <div className="flex w-full shrink-0 flex-col items-center gap-8 self-stretch rounded-b-md border-[0.2px] border-t-0 border-cream-400 p-[8px] pt-[32px] text-center">
      <div className="flex flex-col gap-[16px]">
        <SearchingMan />
        <div className="flex flex-col gap-[8px]">
          <p className="text-lg font-medium leading-[128%] text-dark-gray-300 dark:text-dark-gray-200">
            No data available
          </p>
          <p className="pb-[32px] text-center font-normal leading-[96%] text-dark-gray-200 dark:text-dark-gray-100">
            There is no available data to show.
            <br />
            Please choose different filters and try again.{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
