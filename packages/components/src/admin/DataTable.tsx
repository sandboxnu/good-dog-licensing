"use client";

import React from "react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@good-dog/ui/table";

export type AdminDataTypes = {
  [T in keyof GetProcedureOutput<"adminData">]: GetProcedureOutput<"adminData">[T][number];
};

interface DataColumn<T extends keyof AdminDataTypes> {
  accessorKey: keyof AdminDataTypes[T] & string;
  header: string;
  cell?: (
    value: AdminDataTypes[T][keyof AdminDataTypes[T] & string],
  ) => React.ReactNode;
}

const columns: { [T in keyof AdminDataTypes]: DataColumn<T>[] } = {
  users: [
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "stageName", header: "Stage Name" },
    { accessorKey: "isSongWriter", header: "Songwriter?" },
    { accessorKey: "isAscapAffiliated", header: "ASCAP Affiliated?" },
    { accessorKey: "isBmiAffiliated", header: "BMI Affiliated?" },
    { accessorKey: "createdAt", header: "Date of Creation" },
    { accessorKey: "updatedAt", header: "Date Last Updated" },
  ],
  groups: [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "createdAt", header: "Date of Creation" },
    { accessorKey: "updatedAt", header: "Date Last Updated" },
  ],
};

interface DataTableProps<T extends keyof AdminDataTypes> {
  table: T;
  data: AdminDataTypes[T][];
}

export function DataTable<T extends keyof AdminDataTypes>({
  table,
  data,
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader className="text-nowrap text-lg">
        <TableRow>
          {columns[table].map((column) => (
            <TableHead key={column.accessorKey}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="text-base">
        {data.map((entry, idx) => (
          <TableRow key={idx}>
            {columns[table].map((column) => (
              <TableCell key={column.accessorKey}>
                {column.cell?.(entry[column.accessorKey]) ??
                  String(entry[column.accessorKey])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
