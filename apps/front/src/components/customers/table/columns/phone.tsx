import { Customer } from "@seminar/common"
import { ColumnDef } from "@tanstack/react-table"

export const phoneColumn: ColumnDef<Customer> = {
  accessorKey: "phone",
  header: "Phone",
  cell: ({ row }) => {
    return <div className="font-medium">{row.original.phone}</div>
  },
}
