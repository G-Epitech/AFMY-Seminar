import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { flexRender, useReactTable } from "@tanstack/react-table";
import { Coach } from "@/types/coach";
import { columns } from "./config";

export interface CoachesTableBodyProps {
  table: ReturnType<typeof useReactTable<Coach>>;
}

export default function CoachesTableBody(
  { table }: CoachesTableBodyProps
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
            colSpan={columns.length}
            className="h-24 text-center"
          >
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </>
}
