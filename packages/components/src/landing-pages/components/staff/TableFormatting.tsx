"use client";

import Dropdown from "../../../base/Dropdown";
import SearchingMan from "../../../svg/homepage/admin/SearchingMan";

/**
 * Mobile layout for staff tables: on phones each row renders as a card and
 * sorting moves into a "Sort by" dropdown. Desktop keeps the grid table.
 */
export const TABLE_DESKTOP_ONLY_CLASS = "max-md:hidden";

export function MobileSortSelect<T extends string>({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (newValue: T) => void;
}) {
  return (
    <div className="md:hidden">
      <Dropdown
        id={id}
        label="Sort by"
        placeholder="Sort by"
        value={value}
        options={options}
        arrow
        onChange={(newValue) => onChange(newValue as T)}
      />
    </div>
  );
}

export function MobileCardList({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3 md:hidden">{children}</div>;
}

export function MobileCard({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-[16px] border-[0.5px] border-cream-400 bg-white p-4 dark:bg-dark-gray-600 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

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
    <div className="flex flex-col gap-[24px] self-stretch rounded-[24px] bg-gray-100 pt-[32px] pr-[24px] pb-[48px] pl-[24px] shadow-card-light max-md:gap-[16px] max-md:px-[12px] max-md:pt-[16px] max-md:pb-[24px] dark:bg-dark-gray-600">
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
          <p className="text-lg leading-[128%] font-medium text-dark-gray-300 dark:text-dark-gray-200">
            No data available
          </p>
          <p className="pb-[32px] text-center leading-[96%] font-normal text-dark-gray-200 dark:text-dark-gray-100">
            There is no available data to show.
            <br />
            Please choose different filters and try again.{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
