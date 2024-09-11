import { Employee } from "@seminar/common";
import { call } from "../call";

export function _delete(id: Employee["id"]) {
    return call<undefined, undefined>(
      "DELETE",
      `/employee/${id}`,
    );
}
