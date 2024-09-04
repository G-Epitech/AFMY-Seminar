import { Customer } from "@seminar/common";
import SelectTable from "../../table/select";
import { customersColumns } from "./columns";
import CustomersTableActions from "./actions";

export interface CustomersTableProps {
  customers: Customer[];
}

export default function CustomersTable(
  { customers }: CustomersTableProps
) {
  return (
    <SelectTable
      data={customers}
      columns={customersColumns}
      filterSearchColumn='email'
      filterSearchPlaceholder='Filter emails...'
      actionComponent={({ table }) => <CustomersTableActions table={table} />}
    />
  )
}
