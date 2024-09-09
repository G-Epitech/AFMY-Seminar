import { Customer, OutGetCustomerPaymentsDTO, QueryGetCustomerPaymentsDTO } from "@seminar/common";
import { call } from "../../call";

export function list(id: Customer["id"], query?: QueryGetCustomerPaymentsDTO) {
  const filteredQuery = Object.fromEntries(
    Object.entries(query || {}).filter(([, value]) => value !== undefined),
  );

  return call<undefined, OutGetCustomerPaymentsDTO>(
    "GET",
    `/customers/${id}/payments?${new URLSearchParams(filteredQuery).toString()}`,
  );
}
