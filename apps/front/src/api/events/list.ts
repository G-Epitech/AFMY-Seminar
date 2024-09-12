import { GetEventsDTO, GetEventsQuery } from "@seminar/common";
import { call } from "../call";

export function list(query: GetEventsQuery) {
  return call<undefined, GetEventsDTO>(
    "GET",
    `/events?${new URLSearchParams(query as any)}`,
  );
}
