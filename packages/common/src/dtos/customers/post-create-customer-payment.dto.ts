import { Customer, Payment, PaymentMethod } from "../../types";
import { IdOf } from "../../utils";
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";

export class ParamPostCreateCustomerPaymentDTO {
  @IsInt()
  @Type(() => Number)
  public id: IdOf<Customer>;
}

export class InPostCreateCustomerPaymentDTO {
  @IsDate()
  public date: string;

  @IsNumber()
  public amount: number;

  @IsEnum(PaymentMethod)
  public method: PaymentMethod;

  @IsString()
  @IsOptional()
  public comment?: string;
}

export type OutPostCreateCustomerPaymentDTO = Payment;
