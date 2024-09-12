import auth from "./auth";
import { call } from "./call";
import customers from "./customers";
import employees from "./employees";
import statistics from "./statistics";
import events from "./events";

const api = {
  call,
  auth,
  employees,
  customers,
  statistics,
  events,
};

export default api;
