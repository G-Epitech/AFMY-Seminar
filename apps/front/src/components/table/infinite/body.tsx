import { columns } from "@/components/coaches/table/columns";
import { TableBody, TableCell, TableRow } from "@/components/ui/datat-table";
import { flexRender, useReactTable } from "@tanstack/react-table";

export interface InfiniteTableBodyProps<T> {
  table: ReturnType<typeof useReactTable<T>>;
}

export default function InfiniteTableBody<T>({
  table,
}: InfiniteTableBodyProps<T>) {
  const { rows } = table.getRowModel();
  return (
    <>
      <TableBody>
        {rows.length ? (
          rows.map((row) => {
            return (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );
}
