import { call } from "../call";

export function _delete(id: number) {
  return call<undefined, undefined>("DELETE", `/tips/${id}`);
}
