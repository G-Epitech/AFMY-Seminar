import { Customer, Payment, PaymentMethod } from "../../types";
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { IdOf } from "../../utils";

export class InPatchCustomerPaymentDTO {
  @IsDate()
  @IsOptional()
  public date?: string;

  @IsInt()
  @IsOptional()
  public amount?: number;

  @IsEnum(PaymentMethod)
  @IsOptional()
  public method?: PaymentMethod;

  @IsString()
  @IsOptional()
  public comment?: string;
}

export class ParamPatchCustomerPaymentDTO {
  @IsNumber()
  @Type(() => Number)
  public id: IdOf<Customer>;

  @IsNumber()
  @Type(() => Number)
  public paymentId: IdOf<Payment>;
}

export type OutPatchCustomerPaymentDTO = Payment;
