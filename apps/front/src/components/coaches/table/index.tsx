import { Coach } from "@/types/coach";
import SelectTable from "../../table/select";
import CoachesTableActions from "./actions";
import { coachesColumns } from "./columns";

export interface CoachesTableProps {
  coaches: Coach[];
}

export default function CoachesTable(
  { coaches }: CoachesTableProps
) {
  return (
    <SelectTable
      data={coaches}
      columns={coachesColumns}
      filterSearchColumn='email'
      filterSearchPlaceholder='Filter emails...'
      actionComponent={({ table }) => <CoachesTableActions table={table} />}
    />
  )
}
