import { OutGetCustomersDTO, OutGetEmployeesDTO, QueryGetEmployeesDTO } from "@seminar/common";
import { call } from "../call";

export function list(query?: QueryGetEmployeesDTO) {
  const filteredQuery = Object.fromEntries(
    Object.entries(query || {}).filter(([, value]) => value !== undefined),
  );

  return call<undefined, OutGetEmployeesDTO>(
    "GET",
    `/employees?${new URLSearchParams(filteredQuery).toString()}`,
  );
}
