import { OutGetCustomerClothesDTO, ParamGetCustomerClothesDTO, QueryGetCustomerClothesDTO } from "@seminar/common";
import { call } from "../call";

export function clothes(param: ParamGetCustomerClothesDTO, query?: QueryGetCustomerClothesDTO) {
  const filteredQuery = Object.fromEntries(
    Object.entries(query || {}).filter(([, value]) => value !== undefined),
  );

  return call<undefined, OutGetCustomerClothesDTO>(
    "GET",
    `/customers/${param.id}/clothes?${new URLSearchParams(filteredQuery).toString()}`,
  );
}
