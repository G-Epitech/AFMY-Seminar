import { Button } from "@/components/ui/button";
import { useReactTable } from "@tanstack/react-table";

export interface SelectTableFooterProps<T> {
  table: ReturnType<typeof useReactTable<T>>;
}

export default function SelectTableFooter<T>(
  { table }: SelectTableFooterProps<T>
) {
  return <>
    <div className="flex items-center justify-end space-x-2 w-full mt-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  </>
}
