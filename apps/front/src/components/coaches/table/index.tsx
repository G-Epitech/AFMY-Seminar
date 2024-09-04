import { Coach } from "@/types/coach";
import SelectTable from "../../table/select";
import { selectColumn } from "./columns/select";
import { coachColumn } from "./columns/coach";
import { emailColumn } from "./columns/email";
import { phoneColumn } from "./columns/phone";
import { numberOfCustomersColumn } from "./columns/numberOfCustomers";
import { actionsColumn } from "./columns/actions";
import CoachesTableActions from "./actions";

export interface CoachesTableProps {
  coaches: Coach[];
}

export default function CoachesTable(
  { coaches }: CoachesTableProps
) {
  const columns = [
    selectColumn,
    coachColumn,
    emailColumn,
    phoneColumn,
    numberOfCustomersColumn,
    actionsColumn,
  ]
  
  return (
    <SelectTable
      data={coaches}
      columns={columns}
      filterSearchColumn='email'
      filterSearchPlaceholder='Filter emails...'
      actionComponent={({ table }) => <CoachesTableActions table={table} />}
    />
  )
}