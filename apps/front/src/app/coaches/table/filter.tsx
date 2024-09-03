import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ChevronDownIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useReactTable } from "@tanstack/react-table";
import { Coach } from "@/types/coach";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

export interface CoachesTableFiltersProps {
  table: ReturnType<typeof useReactTable<Coach>>;
}

export default function CoachesTableFilters(
  { table }: CoachesTableFiltersProps
) {
  const [filter, setFilter] = useState<Boolean>(false);

  const toggleFilter = () => {
    setFilter(prev => !prev);
  }

  const inputFilter = (
    <Input
      placeholder="Filter emails..."
      value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn("email")?.setFilterValue(event.target.value)
      }
      className="max-w-sm"
    />
  );

  return <>
    <div className="flex flex-wrap items-center justify-center py-4 gap-3">
      <div className="sm:ml-auto flex gap-2 w-full sm:w-auto justify-center flex-row items-center space-x-4 text-sm">
        <div className="flex flex-row-reverse items-center space-x-4">
          <MagnifyingGlassIcon
            className="h-4 w-4 ms-4"
            onClick={toggleFilter}
          />
          <div className="hidden sm:block">
            {filter && inputFilter}
          </div>
        </div>
        <Separator orientation="vertical" className="h-5" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="block sm:hidden">
        {filter && inputFilter}
      </div>
    </div>
  </>
}
