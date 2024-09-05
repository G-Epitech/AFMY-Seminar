import { IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { IdOf } from "../../utils";
import { Customer, Page, Payment } from "../../types";

export class InGetCustomerPaymentsDTO {}

export class QueryGetCustomerPaymentsDTO {
  @IsNumber()
  @Type(() => Number)
  public page: number = 0;

  @IsNumber()
  @Type(() => Number)
  public size: number = 10;
}

export class ParamGetCustomerPaymentsDTO {
  @IsNumber()
  @Type(() => Number)
  public id: IdOf<Customer>;
}

export type OutGetCustomerPaymentsDTO = Page<Payment>;
