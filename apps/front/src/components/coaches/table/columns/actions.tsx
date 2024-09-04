import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Coach } from "@/types/coach";
import { useRouter } from "next/navigation";

export const actionsColumn: ColumnDef<Coach> = {
  id: "actions",
  header: () => (<div className="text-right">Actions</div>),
  enableHiding: false,
  cell: ({ row }) => {
    const coach = row.original;
    const router = useRouter();

    return (
      <div className="flex items-center justify-end">
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
              onClick={() => router.push(`/coaches/${coach.id}`)}
            >
              view profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(coach.email)}
            >
              Copy coach email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Promote</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  },
}
