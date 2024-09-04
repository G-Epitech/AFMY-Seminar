import { Coach } from "@/types/coach"
import { ColumnDef } from "@tanstack/react-table"

export const phoneColumn: ColumnDef<Coach> = {
  accessorKey: "phone",
  header: "Phone",
  cell: ({ row }) => {
    return <div className="font-medium">{row.original.phone}</div>
  },
}
