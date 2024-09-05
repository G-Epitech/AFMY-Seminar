import { Clothe, ClotheType, Customer } from "../../types";
import { IdOf } from "../../utils";
import { IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";
import { Type } from "class-transformer";

export class ParamPostCreateCustomerClotheDTO {
  @IsInt()
  @Type(() => Number)
  public id: IdOf<Customer>;
}

export class InPostCreateCustomerClotheDTO {
  @IsEnum(ClotheType)
  public type: ClotheType;

  @IsString()
  @IsNotEmpty()
  public image: string;
}

export type OutPostCreateCustomerClotheDTO = Clothe;
