import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional } from "class-validator";
import { Gender, Permission } from "../../types";

export class InGetEmployeesCountDTO {};

export class QueryGetEmployeesCountDTO {
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

export type OutGetEmployeesCountDTO = number;
