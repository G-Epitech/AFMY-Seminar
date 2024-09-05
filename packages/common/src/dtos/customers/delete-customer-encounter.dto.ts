import { IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { IdOf } from "../../utils";
import { Customer, Encounter } from "../../types";

export class InDeleteCustomerEncounterDTO {}

export class ParamDeleteCustomerEncounterDTO {
  @IsNumber()
  @Type(() => Number)
  public id: IdOf<Customer>;

  @IsNumber()
  @Type(() => Number)
  public encounterId: IdOf<Encounter>;
}

export type OutDeleteCustomerEncounterDTO = Encounter;
