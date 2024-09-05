import { AstrologicalSign, Customer, Gender, Page } from "../../types";
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";

export class InGetCustomersDTO {}

export class QueryGetCustomersDTO {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public page: number = 0;

  @IsNumber()
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

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public coachId?: number;

  @IsEnum(AstrologicalSign)
  @IsOptional()
  @Type(() => String)
  public astrologicalSign?: AstrologicalSign;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public age?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  public createdBefore?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  public createdAfter?: Date;
}

export type OutGetCustomersDTO = Page<Customer>;
