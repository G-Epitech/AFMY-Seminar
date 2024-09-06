import { OutGetMeDto } from "@seminar/common";
import { call } from "../call";

export function me() {
    return call<undefined, OutGetMeDto>("GET", "/employees/me");
}
