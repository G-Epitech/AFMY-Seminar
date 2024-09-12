import { Customer, Employee, Page } from "../../types";
import { IdOf } from "../../utils";
import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class InGetEmployeeCustomersDTO {}

export class ParamGetEmployeeCustomersDTO {
  @IsInt()
  @Type(() => Number)
  public id: IdOf<Employee>;
}

export class QueryGetEmployeeCustomersDTO {
  @IsInt()
  @Type(() => Number)
  public page: number = 0;

  @IsInt()
  @Type(() => Number)
  public size: number = 10;
}

export type OutGetEmployeeCustomersDTO = Page<Customer>;
