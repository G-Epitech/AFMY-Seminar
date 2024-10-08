import { Type } from "class-transformer";
import {
  AstrologicalSign,
  Customer,
  Employee,
  Gender,
  PhotoFormat,
} from "../../types";
import { IdOf } from "../../utils";
import {
  IsBase64,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export class InPostCreateCustomerDTO {
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

  @IsString()
  public description: string;

  @IsDate()
  @Type(() => Date)
  public birthDate: Date;

  @IsEnum(Gender)
  public gender: Gender;

  @IsEnum(AstrologicalSign)
  public sign: AstrologicalSign;

  @IsEnum(PhotoFormat)
  @IsOptional()
  public photoFormat?: PhotoFormat;

  @IsString()
  @IsOptional()
  public address?: string;

  @IsInt()
  @IsOptional()
  public coachId?: IdOf<Employee>;

  @IsString()
  @IsOptional()
  public country?: string;
}

export type OutPostCreateCustomerDTO = Customer;
