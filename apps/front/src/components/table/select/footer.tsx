import { Button } from "@/components/ui/button";
import { useReactTable } from "@tanstack/react-table";

export interface SelectTableFooterProps<T> {
  table: ReturnType<typeof useReactTable<T>>;
  isLastPage: boolean;
  handleNextPage: (table: ReturnType<typeof useReactTable<T>>) => void;
  handlePreviousPage: (table: ReturnType<typeof useReactTable<T>>) => void;
  maxRows: number;
}

export default function SelectTableFooter<T>(
  { table, isLastPage, handleNextPage, handlePreviousPage, maxRows }: SelectTableFooterProps<T>
) {
  return <>
    <div className="flex items-center justify-end space-x-2 w-full mt-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {maxRows} row(s) selected.
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePreviousPage(table)}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNextPage(table)}
          disabled={isLastPage}
        >
          Next
        </Button>
      </div>
    </div>
  </>
}
