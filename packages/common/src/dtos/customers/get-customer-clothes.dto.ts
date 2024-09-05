import { IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { IdOf } from "../../utils";
import { Clothe, Customer, Page } from "../../types";

export class InGetCustomerClothesDTO {}

export class QueryGetCustomerClothesDTO {
  @IsNumber()
  @Type(() => Number)
  public page: number = 0;

  @IsNumber()
  @Type(() => Number)
  public size: number = 10;
}

export class ParamGetCustomerClothesDTO {
  @IsNumber()
  @Type(() => Number)
  public id: IdOf<Customer>;
}

export type OutGetCustomerClothesDTO = Page<Clothe>;
