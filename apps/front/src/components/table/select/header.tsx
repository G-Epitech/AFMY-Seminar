import { TableHead, TableHeader, TableRow } from "@/components/ui/datat-table"
import { flexRender, useReactTable } from "@tanstack/react-table"

export interface SelectTableHeaderProps<T> {
  table: ReturnType<typeof useReactTable<T>>;
}

export default function SelectTableHeader<T>(
  { table }: SelectTableHeaderProps<T>
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
