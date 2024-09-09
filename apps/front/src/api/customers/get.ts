import { Customer } from "@seminar/common";
import { call } from "../call";

export function get(id: Customer["id"]) {
    return call<undefined, Customer>(
      "GET",
      `/customers/${id}`,
    );
}
