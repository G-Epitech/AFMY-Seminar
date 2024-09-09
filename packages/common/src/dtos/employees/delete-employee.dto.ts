import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class InDeleteEmployeeDTO {}

export class ParamDeleteEmployeeDTO {
  @IsInt()
  @Type(() => Number)
  public id: number;
}

export type OutDeleteEmployeeDTO = { deleted: true };
