import { GetTipsDto } from "@seminar/common";
import { call } from "../call";

export function list() {
  return call<undefined, GetTipsDto>("GET", `/tips`);
}
