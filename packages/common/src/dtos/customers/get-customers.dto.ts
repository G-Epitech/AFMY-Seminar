import { Customer, Page } from '../../types';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class InGetCustomersDTO {
}

export class QueryGetCustomersDTO {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public page: number = 0;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public size: number = 10;
}

export type OutGetCustomersDTO = Page<Customer>;
