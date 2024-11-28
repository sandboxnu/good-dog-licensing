import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@good-dog/ui/table";

interface ColumnDef<T> {
  accessorKey: keyof T;
  header: string;
  cell?: (value: T[keyof T]) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  itemsPerPage?: number;
}

export function DataTable<T extends object>({
  columns,
  data,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="text-nowrap text-lg">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey as string}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="text-base">
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={column.accessorKey as string}>
                    {column.cell
                      ? column.cell(row[column.accessorKey])
                      : row[column.accessorKey]?.toString()}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
