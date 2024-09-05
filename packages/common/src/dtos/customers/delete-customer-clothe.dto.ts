import { IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { IdOf } from "../../utils";
import { Clothe, Customer } from "../../types";

export class InDeleteCustomerClotheDTO {}

export class ParamDeleteCustomerClotheDTO {
  @IsNumber()
  @Type(() => Number)
  public id: IdOf<Customer>;

  @IsNumber()
  @Type(() => Number)
  public clotheId: IdOf<Clothe>;
}

export type OutDeleteCustomerClotheDTO = Clothe;
