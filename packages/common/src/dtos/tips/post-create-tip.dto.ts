import { IsNotEmpty, IsString } from "class-validator";

export class PostCreateTipDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
