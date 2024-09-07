import { OutGetCustomersCountDTO } from "@seminar/common";
import { call } from "../call";

export function count() {
  return call<undefined, OutGetCustomersCountDTO>(
    "GET",
    "/customers/count",
  );
}
