import { customerColumn } from "./customer";
import { emailColumn } from "./email";
import { actionsColumn } from "./actions";
import { phoneColumn } from "./phone";
import { Customer } from "@seminar/common";

export const customersColumns = (
  onUnassignCustomer: (customer: Customer) => void,
) => [
  customerColumn,
  emailColumn,
  phoneColumn,
  actionsColumn(onUnassignCustomer),
];
