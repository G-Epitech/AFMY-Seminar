import { selectColumn } from "./select";
import { customerColumn } from "./customer";
import { emailColumn } from "./email";
import { phoneColumn } from "./phone";
import { actionsColumn } from "./actions";
import { paymentColumn } from "./payment";

export const customersColumns = [
  selectColumn,
  customerColumn,
  emailColumn,
  phoneColumn,
  paymentColumn,
  actionsColumn,
]
