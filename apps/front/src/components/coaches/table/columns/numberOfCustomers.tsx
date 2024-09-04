import { Button } from "@/components/ui/button"
import { Employee } from "@seminar/common"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"

export const numberOfCustomersColumn: ColumnDef<Employee> = {
  accessorKey: "numberOfCustomers",
  header: ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Number of customers
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    )
  },
  cell: ({ row }) => {
    return <div className="font-medium ">{row.original.numberOfCustomers || 0}</div>
  },
}
