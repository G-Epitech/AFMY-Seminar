import { MeetingEvent } from "../../types";
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";

export class InUpdateEventDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  start?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  end?: Date;

  @IsInt()
  @IsOptional()
  maxParticipants?: number;

  @IsInt()
  @IsOptional()
  locationId?: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsInt()
  @IsOptional()
  employeeId?: number;
}

export type OutUpdateEventDTO = MeetingEvent;
