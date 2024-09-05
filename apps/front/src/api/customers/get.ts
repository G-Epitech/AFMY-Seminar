import { OutGetCustomersDTO } from "@seminar/common";
import { call } from "../call";

export function get(name?: string) {
    const query = new URLSearchParams();

    if (name !== undefined) {
        query.append("name", name);
    }
    return call<undefined, OutGetCustomersDTO>("GET",`/customers?${query.toString()}`);
}
