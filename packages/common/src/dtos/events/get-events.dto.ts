import { IsInt, IsOptional, Max, Min } from "class-validator";
import { MeetingEvent } from "../../types";
import { Type } from "class-transformer";

export class GetEventsQuery {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(11)
  @Type(() => Number)
  month?: number;

  @IsInt()
  @Min(1582)
  @Type(() => Number)
  year: number;
}

export type GetEventsDTO = {
  count: number;
  events: MeetingEvent[];
};
