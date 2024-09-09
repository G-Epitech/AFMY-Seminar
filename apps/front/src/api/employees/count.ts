import { OutGetEmployeesCountDTO, QueryGetEmployeesCountDTO } from "@seminar/common";
import { call } from "../call";

export function count(query: QueryGetEmployeesCountDTO) {
  const filteredQuery = Object.fromEntries(
    Object.entries(query || {}).filter(([, value]) => value !== undefined),
  );

  return call<undefined, OutGetEmployeesCountDTO>(
    "GET",
    "/employees/count?" + new URLSearchParams(filteredQuery).toString(),
  );
}
