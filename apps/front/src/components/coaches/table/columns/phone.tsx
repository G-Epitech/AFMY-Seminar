import { Employee } from "@seminar/common"
import { ColumnDef } from "@tanstack/react-table"

export const phoneColumn: ColumnDef<Employee> = {
  accessorKey: "phone",
  header: "Phone",
  cell: ({ row }) => {
    return <div className="font-medium">{row.original.phone}</div>
  },
}
