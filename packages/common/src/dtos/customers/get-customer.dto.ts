import { Customer } from '../../types';
import { IdOf } from '../../utils';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class InGetCustomerDTO {
}

export class ParamGetCustomerDTO {
  @IsNumber()
  @Type(() => Number)
  public id: IdOf<Customer>;
}

export type OutGetCustomerDTO = Customer;
