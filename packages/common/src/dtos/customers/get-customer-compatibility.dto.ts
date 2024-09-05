import { Customer, FullCompatibility } from "../../types";
import { IdOf } from "../../utils";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class InGetCustomerCompatibilityDTO {}

export class ParamGetCustomerCompatibilityDTO {
  @IsNumber()
  @Type(() => Number)
  public id: IdOf<Customer>;

  @IsNumber()
  @Type(() => Number)
  public otherId: IdOf<Customer>;
}

export type OutGetCustomerCompatibilityDTO = FullCompatibility;
