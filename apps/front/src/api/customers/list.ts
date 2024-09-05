import { OutGetCustomersDTO, QueryGetCustomersDTO } from "@seminar/common";
import { call } from "../call";

export function list(query: QueryGetCustomersDTO) {
    return call<QueryGetCustomersDTO, OutGetCustomersDTO>(
        "GET",
        "/customers",
        query
    );
}
