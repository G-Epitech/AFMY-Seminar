import { ColumnDef } from "@tanstack/react-table"
import { Coach } from "@/types/coach";
import { selectColumn } from "./config/select";
import { coachColumn } from "./config/coach";
import { emailColumn } from "./config/email";
import { phoneColumn } from "./config/phone";
import { nbOfCustomersColumn } from "./config/nbOfCustomers";
import { actionsColumn } from "./config/actions";

export const columns: ColumnDef<Coach>[] = [
  selectColumn,
  coachColumn,
  emailColumn,
  phoneColumn,
  nbOfCustomersColumn,
  actionsColumn,
]
