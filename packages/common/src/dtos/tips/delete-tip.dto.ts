import { IsInt } from "class-validator";
import { Type } from "class-transformer";
import { IdOf } from "../../utils";
import { Tip } from "../../types";

export class ParamDeleteTipDto {
  @IsInt()
  @Type(() => Number)
  id: IdOf<Tip>;
}
