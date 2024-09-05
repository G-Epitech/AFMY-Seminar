import { IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { IdOf } from "../../utils";
import { Customer, Encounter, Page } from "../../types";

export class InGetCustomerEncountersDTO {}

export class QueryGetCustomerEncountersDTO {
  @IsNumber()
  @Type(() => Number)
  public page: number = 0;

  @IsNumber()
  @Type(() => Number)
  public size: number = 10;
}

export class ParamGetCustomerEncountersDTO {
  @IsNumber()
  @Type(() => Number)
  public id: IdOf<Customer>;
}

export type OutGetCustomerEncountersDTO = Page<Encounter>;
