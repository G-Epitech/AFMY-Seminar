import { count } from "./count";
import { _delete } from "./delete";
import { list } from "./list";
import { me } from "./me";
import { get } from "@/api/employees/get";
import { customers } from "@/api/employees/customers";

const employees = {
    me,
    list,
    count,
    get,
    "delete": _delete,
    customers,
};

export default employees;
