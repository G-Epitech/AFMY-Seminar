import { TableHead, TableHeader, TableRow } from "@/components/ui/datat-table";
import { flexRender, useReactTable } from "@tanstack/react-table";

export interface InfiniteTableHeaderProps<T> {
  table: ReturnType<typeof useReactTable<T>>;
  style?: React.CSSProperties;
}

export default function InfiniteTableHeader<T>({
  table,
  style,
}: InfiniteTableHeaderProps<T>) {
  return (
    <>
      <TableHeader style={style}>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
    </>
  );
}
