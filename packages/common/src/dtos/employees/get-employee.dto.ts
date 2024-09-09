import { Employee } from "../../types";
import { IdOf } from "../../utils";
import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class InGetEmployeeDTO {}

export class ParamGetEmployeeDTO {
  @IsInt()
  @Type(() => Number)
  public id: IdOf<Employee>;
}

export type OutGetEmployeeDTO = Employee;
