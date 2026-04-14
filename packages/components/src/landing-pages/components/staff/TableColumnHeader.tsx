import SortingUpArrow from "../../../svg/admin/dashboard/SortingUpArrow";

interface TableColumnHeaderProps<T> {
  columnName: string;
  currentSort: T;
  sortColumn: T;
  setSortColumn: (newSort: T) => void;
}

export default function TableColumnHeader<T>({
  columnName,
  currentSort,
  sortColumn,
  setSortColumn,
}: TableColumnHeaderProps<T>) {
  const isCurrentSort = currentSort === sortColumn;

  return (
    <button
      className="group inline-flex items-center gap-1"
      onClick={() => setSortColumn(sortColumn)}
      type="button"
    >
      <span className="dark:text-white">{columnName}</span>
      <span
        className={
          isCurrentSort
            ? "opacity-100"
            : "opacity-0 transition-opacity group-hover:opacity-100"
        }
      >
        <SortingUpArrow color={isCurrentSort ? "green" : "gray"} />
      </span>
    </button>
  );
}
