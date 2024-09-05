import { AstrologicalSign, Customer, Gender } from "../../types";
import {
  IsBase64,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { IdOf } from "../../utils";

export class InPatchCustomerDTO {
  @IsString()
  @IsOptional()
  public name?: string;

  @IsEmail()
  @IsOptional()
  public email?: string;

  @IsString()
  @IsOptional()
  public surname?: string;

  @IsPhoneNumber()
  @IsOptional()
  public phone?: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsDateString()
  @IsOptional()
  public birthDate?: string;

  @IsEnum(Gender)
  @IsOptional()
  public gender?: Gender;

  @IsEnum(AstrologicalSign)
  @IsOptional()
  public sign?: AstrologicalSign;

  @IsBase64()
  @IsOptional()
  public photo?: string;

  @IsString()
  @IsOptional()
  public address?: string;

  @IsString()
  @IsOptional()
  public country?: string;
}

export class ParamPatchCustomerDTO {
  @IsNumber()
  @Type(() => Number)
  public id: IdOf<Customer>;
}

export type OutPatchCustomerDTO = Customer;
