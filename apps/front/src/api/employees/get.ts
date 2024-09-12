import { OutGetMeDto } from "@seminar/common";
import { call } from "../call";

export function get(id: number) {
  return call<undefined, OutGetMeDto>("GET", `/employees/${id}`);
}
