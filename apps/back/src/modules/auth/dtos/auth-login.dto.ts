import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLogInDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
