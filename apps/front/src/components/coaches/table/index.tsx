import { Table } from "@/components/ui/table";
import { Coach } from "@/types/coach";
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import CoachTableFooter from "./footer";
import { columns } from "./config";
import CoachesTableBody from "./body";
import CoachesTableHeader from "./header";
import CoachesTableFilters from "./filter";

export interface CoachesTableProps {
  coaches: Coach[];
}

export default function CoachesTable(
  { coaches }: CoachesTableProps
) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: coaches,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  useEffect(() => {
    console.log(rowSelection)
  }, [rowSelection])

  return (
    <div className="w-full">
      <CoachesTableFilters table={table} />
      <div className="rounded-md border">
        <Table>
          <CoachesTableHeader table={table} />
          <CoachesTableBody table={table} />
        </Table>
      </div>
      <CoachTableFooter table={table} />
    </div>
  )
}
