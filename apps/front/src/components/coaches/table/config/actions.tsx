import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Coach } from "@/types/coach";

export const actionsColumn: ColumnDef<Coach> = {
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
}
