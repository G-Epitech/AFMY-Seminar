import { Clothe, ClotheType, Customer } from "../../types";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { IdOf } from "../../utils";

export class InPatchCustomerClotheDTO {
  @IsEnum(ClotheType)
  @IsOptional()
  public type?: ClotheType;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  public image?: string;
}

export class ParamPatchCustomerClotheDTO {
  @IsNumber()
  @Type(() => Number)
  public id: IdOf<Customer>;

  @IsNumber()
  @Type(() => Number)
  public clotheId: IdOf<Clothe>;
}

export type OutPatchCustomerClotheDTO = Clothe;
