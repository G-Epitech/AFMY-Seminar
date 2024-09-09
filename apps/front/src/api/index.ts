import auth from "./auth";
import { call } from "./call";
import customers from "./customers";
import employees from "./employees";
import statistics from "./statistics";

const api = {
    call,
    auth,
    employees,
    customers,
    statistics,
};

export default api;
