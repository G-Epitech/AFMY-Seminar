import { IsNotEmpty, IsString } from "class-validator";

export class InGetImageDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
