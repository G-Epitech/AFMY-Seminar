import auth from "./auth";
import { call } from "./call";
import customers from "./customers";
import employees from "./employees";
import statistics from "./statistics";
import tips from "./tips";

const api = {
    call,
    auth,
    employees,
    customers,
    statistics,
    tips,
};

export default api;
