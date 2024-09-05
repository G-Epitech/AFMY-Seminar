import { IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { IdOf } from "../../utils";
import { Customer } from "../../types";

export class InDeleteCustomerDTO {}

export class ParamDeleteCustomerDTO {
  @IsNumber()
  @Type(() => Number)
  public id: IdOf<Customer>;
}

export type OutDeleteCustomerDTO = Customer;
