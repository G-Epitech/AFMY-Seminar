import { Employee, Gender, Permission } from "../../types";
import { IdOf } from "../../utils";
import { Type } from "class-transformer";
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";
import { INVALID_TYPE } from "../../constants";

export class InPatchEmployeeDTO {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  surname?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate?: Date;

  @IsOptional()
  @IsEnum(Gender, {
    context: { isEnum: INVALID_TYPE },
  })
  gender?: Gender;

  @IsOptional()
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address: string | null;

  @IsOptional()
  @IsEnum(Permission, {
    context: { isEnum: INVALID_TYPE },
  })
  permission?: Permission;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  role?: string;
}

export class ParamPatchEmployeeDTO {
  @IsInt()
  @Type(() => Number)
  public id: IdOf<Employee>;
}

export type OutPatchEmployeeDTO = Employee;
