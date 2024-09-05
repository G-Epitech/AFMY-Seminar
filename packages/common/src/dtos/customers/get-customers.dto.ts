import { AstrologicalSign, Customer, Gender, Page } from "../../types";
import {
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
  @IsOptional()
  @IsNotEmpty()
  public name: string = "";

  @IsEmail()
  @IsOptional()
  public email: string = "";

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
}

export type OutGetCustomersDTO = Page<Customer>;
