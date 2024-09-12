import { call } from "../call";

export function get() {
    return call<undefined, []>("GET", "/tips");
}
