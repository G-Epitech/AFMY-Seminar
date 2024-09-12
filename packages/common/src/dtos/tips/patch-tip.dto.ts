import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { IdOf } from "../../utils";
import { Tip } from "../../types";

export class ParamPatchTipDto {
  @IsInt()
  @Type(() => Number)
  id: IdOf<Tip>;
}

export class InPatchTipDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;
}
