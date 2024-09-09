import { Customer } from "@seminar/common";
import SelectTable from "../../table/select";
import { customersColumns } from "./columns";
import CustomersTableActions from "./actions";
import { useReactTable } from "@tanstack/react-table";

export interface CustomersTableProps {
  customers: Customer[];
  isLastPage: boolean;
  handleNextPage: (table: ReturnType<typeof useReactTable<Customer>>) => void;
  handlePreviousPage: (table: ReturnType<typeof useReactTable<Customer>>) => void;
  maxRows: number;
}

export default function CustomersTable(
  { customers, isLastPage, handleNextPage, handlePreviousPage, maxRows }: CustomersTableProps
) {
  return (
    <SelectTable
      data={customers}
      columns={customersColumns}
      filterSearchColumn='email'
      filterSearchPlaceholder='Filter emails...'
      actionComponent={({ table }) => <CustomersTableActions table={table} />}
      isLastPage={isLastPage}
      handleNextPage={handleNextPage}
      handlePreviousPage={handlePreviousPage}
      maxRows={maxRows}
    />
  )
}
