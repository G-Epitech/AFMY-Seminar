import { Customer, Encounter, EncounterStatus } from "../../types";
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { IdOf } from "../../utils";

export class InPatchCustomerEncounterDTO {
  @IsDate()
  @IsOptional()
  public date?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(5)
  public rating?: number;

  @IsEnum(EncounterStatus)
  @IsOptional()
  public status?: EncounterStatus;

  @IsString()
  @IsOptional()
  public comment?: string;

  @IsString()
  @IsOptional()
  public source?: string;

  @IsBoolean()
  @IsOptional()
  public isPositive?: boolean;
}

export class ParamPatchCustomerEncounterDTO {
  @IsNumber()
  @Type(() => Number)
  public id: IdOf<Customer>;

  @IsNumber()
  @Type(() => Number)
  public encounterId: IdOf<Encounter>;
}

export type OutPatchCustomerEncounterDTO = Encounter;
