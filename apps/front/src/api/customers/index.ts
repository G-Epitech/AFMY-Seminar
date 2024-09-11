import { clothes } from "./clothes";
import { compatibility } from "./compatibility";
import { count } from "./count";
import { _delete } from "./delete";
import encounters from "./encounters";
import { get } from "./get";
import { list } from "./list";
import payments from "./payments";

const customers = {
    get,
    compatibility,
    clothes,
    list,
    count,
    encounters,
    payments,
    "delete": _delete,
};

export default customers;
