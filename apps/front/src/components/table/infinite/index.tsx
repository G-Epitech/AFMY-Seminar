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
import React, { useEffect, useState } from "react";
import InfiniteTableBody from "./body";
import InfiniteTableHeader from "./header";
import { Page } from "@seminar/common";
import InfiniteTableFooter from "@/components/table/infinite/footer";

export type InfiniteTableDataFetch<T> = (
  page: number,
  size: number,
) => Promise<Page<T>>;

/**
 * Props for the InfiniteTable component.
 *
 * @template T - The type of data in the table.
 * @property {InfiniteTableDataFetch<T>} fetchData - The function to fetch data for the table.
 * @property {ColumnDef<T>[]} columns - The array of column definitions for the table.
 * @property {string} [filterSearchPlaceholder] - The placeholder text for the filter search input.
 * @property {keyof T} [filterSearchColumn] - The key of the column to be used for filtering the search.
 * @property {boolean} [filterColumn] - Indicates whether filtering should be enabled for the table.
 */
export interface InfiniteTableProps<T> {
  fetchData: InfiniteTableDataFetch<T>;
  fetchSize: number;
  columns: ColumnDef<T>[];
  filterSearchPlaceholder?: string;
  filterSearchColumn?: keyof T;
  filterColumn?: boolean;
  state?: {
    [key: string]: any;
  };
}

export default function InfiniteTable<T>({
  columns,
  fetchData,
  fetchSize,
  state,
}: InfiniteTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pages, setPages] = useState<Page<T>[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [lastState, setLastState] = useState<{
    [key: string]: any;
  }>(state || {});

  const flatData = React.useMemo(() => {
    return pages.flatMap((page) => page.items);
  }, [pages]);

  const insertOrUpdatePage = (page: Page<T>) => {
    const newPages = [...pages];
    if (newPages.length > page.index) {
      newPages[page.index] = page;
    } else {
      newPages.push(page);
    }
    setPages(newPages);
  };

  const onLoadMore = async (): Promise<void> => {
    if (isFetching) return;
    setIsFetching(true);
    const page = await fetchData(pages.length, fetchSize);
    insertOrUpdatePage(page);
    setIsFetching(false);
  };

  const isLast = pages?.[pages.length - 1]?.isLast ?? false;

  const refresh = async () => {
    if (isFetching) return;
    setIsFetching(true);
    const currentPage = pages.length ? pages[pages.length - 1] : null;
    const pageIndex = currentPage
      ? currentPage.items.length === fetchSize
        ? currentPage.index + 1
        : currentPage.index
      : 0;
    const page = await fetchData(pageIndex, fetchSize);
    insertOrUpdatePage(page);
    setIsFetching(false);
  };

  useEffect(() => {
    if (pages.length === 0 && !isFetching) {
      onLoadMore();
    }
  }, []);

  useEffect(() => {
    const changed = state
      ? Object.entries(state).reduce((acc, [key, newValue]) => {
          if (key in lastState && lastState[key] != newValue) return true;
          return acc;
        }, false)
      : false;
    if (changed) {
      refresh();
      setLastState(state!);
    }
  }, [state]);

  const table = useReactTable({
    data: flatData,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div
      className="rounded-md border overflow-auto"
      style={{
        maxHeight: "calc(100vh - 350px)",
      }}
    >
      <Table>
        <InfiniteTableHeader table={table} />
        <InfiniteTableBody table={table} />
      </Table>
      <InfiniteTableFooter
        onLoadMore={onLoadMore}
        isLast={isLast}
        isFetching={isFetching}
      />
    </div>
  );
}
