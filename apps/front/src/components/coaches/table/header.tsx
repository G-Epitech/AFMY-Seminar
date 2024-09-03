import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { flexRender, useReactTable } from "@tanstack/react-table"
import { Coach } from "@/types/coach";

export interface CoachesTableHeaderProps {
  table: ReturnType<typeof useReactTable<Coach>>;
}

export default function CoachesTableHeader(
  { table }: CoachesTableHeaderProps
) {
  return <>
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
              </TableHead>
            )
          })}
        </TableRow>
      ))}
    </TableHeader>
  </>
}
