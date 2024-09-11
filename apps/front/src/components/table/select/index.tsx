import { Table } from "@/components/ui/datat-table";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React, { useState } from "react";
import SelectTableFooter from "./footer";
import SelectTableBody from "./body";
import SelectTableHeader from "./header";
import SelectTableFilters from "./filters";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Props for the SelectTable component.
 *
 * @template T - The type of data in the table.
 * @property {T[]} data - The array of data to be displayed in the table.
 * @property {ColumnDef<T>[]} columns - The array of column definitions for the table.
 * @property {string} [filterSearchPlaceholder] - The placeholder text for the filter search input.
 * @property {keyof T} [filterSearchColumn] - The key of the column to be used for filtering the search.
 * @property {boolean} [filterColumn] - Indicates whether filtering should be enabled for the table.
 */
export interface SelectTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  filterSearchPlaceholder?: string;
  filterSearchColumn?: keyof T;
  filterColumn?: boolean;
  actionComponent?: (props: {
    table: ReturnType<typeof useReactTable<T>>;
  }) => React.ReactNode;
  isLastPage: boolean;
  handleNextPage: (table: ReturnType<typeof useReactTable<T>>) => void;
  handlePreviousPage: (table: ReturnType<typeof useReactTable<T>>) => void;
  maxRows: number;
}

export default function SelectTable<T>({
  data,
  columns,
  filterSearchColumn,
  filterSearchPlaceholder,
  filterColumn,
  actionComponent,
  isLastPage,
  handleNextPage,
  handlePreviousPage,
  maxRows,
}: SelectTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: data,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Card className="p-4">
      <CardHeader className="pt-1 pb-4 px-0">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionComponent && actionComponent({ table })}
          <SelectTableFilters
            table={table}
            filterSearchColumn={filterSearchColumn}
            filterSearchPlaceholder={filterSearchPlaceholder}
            filterColumns={filterColumn}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <SelectTableHeader table={table} />
            <SelectTableBody table={table} />
          </Table>
        </div>

        <SelectTableFooter
          table={table}
          isLastPage={isLastPage}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          maxRows={maxRows}
        />
      </CardContent>
    </Card>
  );
}
