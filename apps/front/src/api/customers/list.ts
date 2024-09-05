import { OutGetCustomersDTO, QueryGetCustomersDTO } from "@seminar/common";
import { call } from "../call";

export function list(query: QueryGetCustomersDTO) {
  const filteredQuery = Object.fromEntries(
    Object.entries(query).filter(([_, value]) => value !== undefined)
  );

  return call<QueryGetCustomersDTO, OutGetCustomersDTO>(
    "GET",
    `/customers?${new URLSearchParams(filteredQuery as Record<string, string>)}`,
  );
}
