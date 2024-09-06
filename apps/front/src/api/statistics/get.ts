import { QueryGetStatisticsDTO, Statistics } from "@seminar/common";
import { call } from "../call";

export function get(query: QueryGetStatisticsDTO) {
  return call<undefined, Statistics>(
    "GET",
    `/statistics?${new URLSearchParams(query as unknown as Record<string, string>).toString()}`
  );
}
