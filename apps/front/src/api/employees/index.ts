import { count } from "./count";
import { _delete } from "./delete";
import { list } from "./list";
import { me } from "./me";

const employees = {
    me,
    list,
    count,
    "delete": _delete,
};

export default employees;
