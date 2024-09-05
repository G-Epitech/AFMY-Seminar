import { Customer, OutGetCustomerCompatibilityDTO } from "@seminar/common";
import { call } from "../call";

export function compatibility(A: Customer["id"], B: Customer["id"]) {
    return call<undefined, OutGetCustomerCompatibilityDTO>(
        "GET",
        `/customers/${A}/compatibility/${B}`
    );
}
