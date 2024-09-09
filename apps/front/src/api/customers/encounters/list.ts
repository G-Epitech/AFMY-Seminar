import { Customer, OutGetCustomerEncountersDTO, QueryGetCustomerEncountersDTO } from "@seminar/common";
import { call } from "../../call";

export function list(id: Customer["id"], query?: QueryGetCustomerEncountersDTO) {
  const filteredQuery = Object.fromEntries(
    Object.entries(query || {}).filter(([, value]) => value !== undefined),
  );

  return call<undefined, OutGetCustomerEncountersDTO>(
    "GET",
    `/customers/${id}/encounters?${new URLSearchParams(filteredQuery).toString()}`,
  );
}
