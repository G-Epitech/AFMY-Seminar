import { useReactTable } from "@tanstack/react-table";
import { Coach } from "@/types/coach";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export interface CoachesTableActionsProps {
  table: ReturnType<typeof useReactTable<Coach>>;
}

export type Action = "delete" | "export";

export default function CoachesTableActions(
  { table }: CoachesTableActionsProps
) {
  const [action, setAction] = useState<Action | null>(null);
  const [selectedRowsIDs, setSelectedRowsIDs] = useState<number[]>([]);

  const handleActionChange = (action: Action) => {
    setAction(action);
  }

  const handleAction = () => {
    console.log(action);
    console.log(selectedRowsIDs);
  }

  useEffect(() => {
    const selectedModelRows = table.getFilteredSelectedRowModel();
    setSelectedRowsIDs(selectedModelRows.rows.map(row => row.original.id));
  }, [table.getState().rowSelection])

  return <>
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <p className="capitalize">{action || "Bulk Action"}</p> <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            key="delete"
            className="capitalize"
            onClick={() => handleActionChange("delete")}
          >
            Delete
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            key="export"
            className="capitalize"
            onClick={() => handleActionChange("export")}
          >
            Export
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button onClick={handleAction} disabled={!action || !selectedRowsIDs.length} className="ml-4">
        Apply
      </Button>
    </div>
  </>
}
