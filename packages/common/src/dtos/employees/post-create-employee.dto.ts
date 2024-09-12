import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsInt, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { Employee, Gender, Permission, PhotoFormat } from "../../types";

export type OutPostCreateEmployeeDTO = Employee;

export class InPostCreateEmployeeDTO {
  @IsString()
  public name: string;

  @IsInt()
  @IsOptional()
  public legacyId?: number;

  @IsEmail()
  public email: string;

  @IsString()
  public surname: string;

  @IsPhoneNumber()
  @IsOptional()
  public phone?: string;

  @IsDate()
  @Type(() => Date)
  public birthDate: Date;

  @IsEnum(Gender)
  public gender: Gender;

  @IsEnum(Permission)
  @Type(() => Number)
  public permission: Permission;

  @IsString()
  @IsOptional()
  public role: string;

  @IsEnum(PhotoFormat)
  @IsOptional()
  public photoFormat?: PhotoFormat;

  @IsString()
  @IsOptional()
  public address?: string;
}