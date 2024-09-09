import { Employee, Gender, Page, Permission } from "../../types";
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";

export class InGetEmployeesDTO {}

export class QueryGetEmployeesDTO {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  public page: number = 0;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  public size: number = 10;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public name?: string;

  @IsEmail()
  @IsOptional()
  public email?: string;

  @IsEnum(Gender)
  @IsOptional()
  @Type(() => String)
  public gender?: Gender;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  public age?: number;

  @IsEnum(Permission)
  @IsOptional()
  @Type(() => Number)
  public permission?: Permission;
}

export type OutGetEmployeesDTO = Page<Employee>;
