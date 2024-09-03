import { ColumnDef } from "@tanstack/react-table"
import { Coach } from "@/types/coach";
import { selectColumn } from "./select";
import { coachColumn } from "./coach";
import { emailColumn } from "./email";
import { phoneColumn } from "./phone";
import { numberOfCustomersColumn } from "./numberOfCustomers";
import { actionsColumn } from "./actions";

export const columns: ColumnDef<Coach>[] = [
  selectColumn,
  coachColumn,
  emailColumn,
  phoneColumn,
  numberOfCustomersColumn,
  actionsColumn,
]
