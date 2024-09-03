import { Coach } from "@/types/coach"
import { ColumnDef } from "@tanstack/react-table"

export const nbOfCustomersColumn: ColumnDef<Coach> = {
  accessorKey: "nbOfCustomers",
  header: () => (<div className="text-right">Number of Customers</div>),
  cell: ({ row }) => {
    return <div className="font-medium text-right">{row.original.numberOfCustomers || 0}</div>
  },
}
