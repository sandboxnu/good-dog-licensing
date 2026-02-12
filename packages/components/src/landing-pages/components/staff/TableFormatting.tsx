"use client";

import SearchingMan from "../../../svg/homepage/admin/SearchingMan";

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
      className={`p-[16px] bg-white dark:bg-dark-gray-600 gap-4 border-[0.2px] border-t-0 border-solid border-cream-400 items-center ${isLast ? "rounded-b-[8px]" : ""}`}
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
      className="p-[16px] bg-cream-100 dark:bg-dark-gray-600 rounded-t-[8px] gap-4 border-[0.2px] border-solid border-cream-400 items-center"
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

export function TableEmptyMessage() {
  return (
    <div className="flex flex-col gap-8 pt-[32px]  shrink-0 self-stretch rounded-b-md items-center text-center border-[0.2px] border-cream-400 border-t-0 p-[8px] w-full">
      <div className="flex flex-col gap-[16px]">
        <SearchingMan />
        <div className="flex flex-col gap-[8px]">
          <p className="text-dark-gray-300 dark:text-dark-gray-200 text-lg font-medium leading-[128%]">
            No data available
          </p>
          <p className="text-dark-gray-200 dark:text-dark-gray-100 text-center font-normal leading-[96%] pb-[32px]">
            There is no available data to show.
            <br />
            Please choose different filters and try again.{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
