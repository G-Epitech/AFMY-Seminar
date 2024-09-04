import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ChevronDownIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

export interface CoachesTableFiltersProps<T> {
  table: ReturnType<typeof useReactTable<T>>;
  filterSearchColumn?: keyof T;
  filterSearchPlaceholder?: string;
  filterColumns?: boolean;
}

export default function SelectTableFilters<T>(
  { table, filterSearchColumn, filterSearchPlaceholder, filterColumns }: CoachesTableFiltersProps<T>
) {
  const [filter, setFilter] = useState<Boolean>(false);

  const toggleFilter = () => {
    setFilter(prev => !prev);
  }

  const inputFilter = (
    <Input
      placeholder={filterSearchPlaceholder}
      value={(table.getColumn(String(filterSearchColumn ? filterSearchColumn : ""))?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(String(filterSearchColumn ? filterSearchColumn : ""))?.setFilterValue(event.target.value)
      }
      className="max-w-sm"
    />
  );

  return <>
    <div className="sm:ml-auto flex gap-2 w-full sm:w-auto justify-center flex-row items-center space-x-4 text-sm">
      {
        filterSearchColumn && <>
          <div className="flex flex-row-reverse items-center space-x-4">
            <MagnifyingGlassIcon
              className="h-4 w-4 ms-4"
              onClick={toggleFilter}
            />
            <div className="hidden sm:block">
              {filter && inputFilter}
            </div>
          </div>

          {
            filterColumns !== false &&
            <Separator orientation="vertical" className="h-5" />
          }
        </>
      }

      {
        filterColumns !== false && <>
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
        </>
      }
    </div>
    <div className="block sm:hidden">
      {filter && inputFilter}
    </div>
  </>
}
