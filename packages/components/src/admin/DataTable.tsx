"use client";

import React from "react";

import type { GetProcedureOutput } from "@good-dog/trpc/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@good-dog/ui/table";

type AdminDataTypes = GetProcedureOutput<"adminData">;
// interface DataColumn<T extends keyof AdminDataTypes> {
//   accessorKey: keyof AdminDataTypes[T][number];
//   header: string;
//   cell?: (value: string) => JSX.Element;
// }

interface DataColumn<T extends keyof AdminDataTypes> {
  accessorKey: keyof AdminDataTypes[T];
  header: string;
  cell?: (value: AdminDataTypes[T][keyof AdminDataTypes[T]]) => JSX.Element;
}

interface DataTableProps<T extends keyof AdminDataTypes> {
  columns: DataColumn<T>[];
  data: AdminDataTypes[T][];
}

export function DataTable<T extends keyof AdminDataTypes>({
  columns,
  data,
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={String(column.accessorKey)}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column) => (
              <TableCell key={String(column.accessorKey)}>
                {column.cell
                  ? column.cell(row[column.accessorKey])
                  : (row[column.accessorKey] as React.ReactNode)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
