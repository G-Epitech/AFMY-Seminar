import { Customer } from "@seminar/common";
import { call } from "../call";

export function _delete(id: Customer["id"]) {
    return call<undefined, undefined>(
      "DELETE",
      `/customers/${id}`,
    );
}
