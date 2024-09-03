import { ColumnDef } from "@tanstack/react-table"
import { Coach } from ".."
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<Coach>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "coach",
    header: "Coach",
    cell: ({ row }) => {
      const firstName = row.original.firstName || ""
      const lastName = row.original.lastName || ""
      const picture = row.original.picture

      return <div className="flex items-center">
        <Avatar>
          <AvatarImage src={picture} alt={`${firstName} ${lastName}`} />
          <AvatarFallback>
            {firstName.length ? firstName[0] : ''}
            {lastName.length ? lastName[0] : ''}
          </AvatarFallback>
        </Avatar>
        <div className="capitalize ms-3">{`${firstName} ${lastName}`}</div>
        </div>
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.original.email}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.phone}</div>
    },
  },
  {
    accessorKey: "nbOfCustomers",
    header: ({ column }) => (<div className="text-right">Number of Customers</div>),
    cell: ({ row }) => {
      return <div className="font-medium text-right">{row.original.numberOfCustomers || 0}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.email)}
            >
              Copy coach email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Promote</DropdownMenuItem>
            <DropdownMenuItem>Demote</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
