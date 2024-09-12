import {
  Customer,
  InPatchCustomerDTO,
  OutPatchCustomerDTO,
} from "@seminar/common";
import { call } from "../call";

export function update(id: Customer["id"], body: InPatchCustomerDTO) {
  return call<InPatchCustomerDTO, OutPatchCustomerDTO>(
    "PATCH",
    `/customers/${id}`,
    body,
  );
}
