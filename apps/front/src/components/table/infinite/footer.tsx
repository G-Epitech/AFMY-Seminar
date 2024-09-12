import { TableFooter, TableRow } from "@/components/ui/datat-table";
import { Button } from "@/components/ui/button";

export interface InfiniteTableFooterProps<T> {
  onLoadMore: () => Promise<void>;
  isLast: boolean;
  isFetching: boolean;
}

export default function InfiniteTableFooter<T>({
  onLoadMore,
  isLast,
  isFetching,
}: InfiniteTableFooterProps<T>) {
  if (isLast) {
    return null;
  }
  return (
    <>
      <div className="flex justify-center py-4">
        <Button
          onClick={onLoadMore}
          disabled={isLast || isFetching}
          size="sm"
          variant="outline"
          className="scale-[80%]"
        >
          {isFetching ? "Loading..." : "Load more"}
        </Button>
      </div>
    </>
  );
}
