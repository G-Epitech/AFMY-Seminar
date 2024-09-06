import { OutGetCustomerClothesDTO, ParamGetCustomerClothesDTO, QueryGetCustomerClothesDTO } from "@seminar/common";
import { call } from "../call";

export function list(query?: QueryGetCustomerClothesDTO) {
  const filteredQuery = Object.fromEntries(
    Object.entries(query || {}).filter(([, value]) => value !== undefined),
  );

  return call<undefined, OutGetCustomerClothesDTO>(
    "GET",
    `/customers?${new URLSearchParams(filteredQuery).toString()}`,
  );
}
