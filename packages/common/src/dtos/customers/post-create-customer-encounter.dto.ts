import { Customer, Encounter, EncounterStatus } from "../../types";
import { IdOf } from "../../utils";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class ParamPostCreateCustomerEncounterDTO {
  @IsInt()
  @Type(() => Number)
  public id: IdOf<Customer>;
}

export class InPostCreateCustomerEncounterDTO {
  @IsDateString()
  public date: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(5)
  public rating?: number;

  @IsEnum(EncounterStatus)
  @IsOptional()
  public status: EncounterStatus = EncounterStatus.PENDING;

  @IsBoolean()
  @IsOptional()
  public isPositive?: boolean;

  @IsString()
  @IsOptional()
  public comment?: string;

  @IsString()
  @IsNotEmpty()
  public source: string;
}

export type OutPostCreateCustomerEncounterDTO = Encounter;
