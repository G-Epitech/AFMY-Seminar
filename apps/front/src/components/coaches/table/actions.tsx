import { useReactTable } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Employee } from "@seminar/common";
import api from "@/api";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export interface CoachesTableActionsProps {
  table: ReturnType<typeof useReactTable<Employee>>;
  setCoaches: (coaches: Employee[]) => void;
}

export type Action = "delete";

export default function CoachesTableActions(
  { table, setCoaches }: CoachesTableActionsProps
) {
  const { toast } = useToast();
  const [action, setAction] = useState<Action | null>(null);
  const [selectedRowsIDs, setSelectedRowsIDs] = useState<number[]>([]);

  const handleActionChange = (action: Action) => {
    setAction(action);
  }

  const handleAction = async () => {
    if (action === "delete") {
      await handleDelete();
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedRowsIDs.map(id => api.employees.delete(id))
      );

      const updatedCoaches = table.getCoreRowModel().rows
        .map(row => row.original)
        .filter(coach => !selectedRowsIDs.includes(coach.id));
      setCoaches(updatedCoaches);
      table.setRowSelection({});

      toast({
        title: "Success",
        description: "The coaches have been deleted",
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the coaches",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const selectedModelRows = table.getFilteredSelectedRowModel();
    setSelectedRowsIDs(selectedModelRows.rows.map(row => row.original.id));
  }, [table.getState().rowSelection])

  return <>
    <div className="w-full sm:w-auto flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <p className="capitalize">{action || "Bulk Action"}</p> <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            key="delete"
            onClick={() => handleActionChange("delete")}
          >
            Delete
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button disabled={!action || !selectedRowsIDs.length} className="ml-4">
            Apply
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected coaches.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </>
}
