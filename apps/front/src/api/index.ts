import auth from "./auth";
import { call } from "./call";
import customers from "./customers";
import employees from "./employees";

const api = {
    call,
    auth,
    employees,
    customers,
};

export default api;
