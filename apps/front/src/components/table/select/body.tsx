import { TableBody, TableCell, TableRow } from "@/components/ui/datat-table";
import { flexRender, useReactTable } from "@tanstack/react-table";
import { coachesColumns } from "../../coaches/table/columns";

export interface SelectTableBodyProps<T> {
  table: ReturnType<typeof useReactTable<T>>;
}

export default function SelectTableBody<T>(
  { table }: SelectTableBodyProps<T>
) {
  return <>
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={coachesColumns.length}
            className="h-24 text-center"
          >
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </>
}
