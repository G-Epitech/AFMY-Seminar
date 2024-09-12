import {
  OutGetEmployeeCustomersDTO,
  OutGetEmployeesDTO,
  QueryGetEmployeeCustomersDTO,
  ParamGetEmployeeCustomersDTO,
} from "@seminar/common";
import { call } from "../call";

export function customers(
  { id }: ParamGetEmployeeCustomersDTO,
  query?: QueryGetEmployeeCustomersDTO,
) {
  const filteredQuery = Object.fromEntries(
    Object.entries(query || {}).filter(([, value]) => value !== undefined),
  );

  return call<undefined, OutGetEmployeeCustomersDTO>(
    "GET",
    `/employees/${id}/customers?${new URLSearchParams(filteredQuery).toString()}`,
  );
}
