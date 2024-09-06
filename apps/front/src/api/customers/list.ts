import { OutGetCustomersDTO, QueryGetCustomersDTO } from "@seminar/common";
import { call } from "../call";

export function list(query?: QueryGetCustomersDTO) {
  const filteredQuery = Object.fromEntries(
    Object.entries(query || {}).filter(([, value]) => value !== undefined),
  );

  return call<undefined, OutGetCustomersDTO>(
    "GET",
    `/customers?${new URLSearchParams(filteredQuery).toString()}`,
  );
}
