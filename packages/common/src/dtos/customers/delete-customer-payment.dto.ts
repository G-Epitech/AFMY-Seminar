import { IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { IdOf } from "../../utils";
import { Customer, Payment } from "../../types";

export class InDeleteCustomerPaymentDTO {}

export class ParamDeleteCustomerPaymentDTO {
  @IsNumber()
  @Type(() => Number)
  public id: IdOf<Customer>;

  @IsNumber()
  @Type(() => Number)
  public paymentId: IdOf<Payment>;
}

export type OutDeleteCustomerPaymentDTO = Payment;
